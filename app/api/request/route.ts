import { NextResponse, type NextRequest } from "next/server";
import {
  validateRequest,
  buildInsertRow,
  validateEnquiry,
  buildEnquiryRow,
  isEnquirySource,
  isBotSubmission,
} from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  if (!rateLimit(clientIp(req)).allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  // Honeypot: a filled hidden field means a bot. Accept silently (201, no body
  // hint) so it can't tell it was caught, but never touch the database.
  if (isBotSubmission(body)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Two intake shapes share this handler: the member Threshold (no source, or
  // an unrecognised one) and the /partners + /invest enquiry pages (source ∈
  // {partners, investor}). Both land in invitation_requests under the same RLS.
  const source =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).source
      : undefined;

  const now = new Date().toISOString();
  let row: Record<string, unknown>;

  // Member-branch handoff: the member Threshold returns the new request's id +
  // email so the client can run the post-submit DNA conversation against the
  // live submit_lead_dna RPC. The enquiry branch returns nothing extra.
  const isEnquiry = isEnquirySource(source);
  let memberId: string | null = null;
  let memberEmail: string | null = null;

  if (isEnquiry) {
    const result = validateEnquiry(source, body);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, errors: result.errors },
        { status: 400 },
      );
    }
    row = buildEnquiryRow(result.data, now);
  } else {
    const result = validateRequest(body);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, errors: result.errors },
        { status: 400 },
      );
    }
    row = buildInsertRow(result.data, now);
    // invitation_requests.id is a uuid PK that accepts an explicit value; we set
    // it client-side so the response can carry it to the DNA conversation.
    memberId = crypto.randomUUID();
    memberEmail = result.data.email;
    row.id = memberId;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("invitation_requests").insert(row);
    if (error) {
      // Don't leak DB internals to the client.
      console.error("invitation_requests insert failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "We could not record your request. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("invitation_requests insert threw:", err);
    return NextResponse.json(
      { ok: false, error: "We could not record your request. Please try again." },
      { status: 500 },
    );
  }

  // Member branch carries the new request id + email for the DNA conversation.
  // Enquiry branch stays exactly as before — a bare { ok: true }.
  if (!isEnquiry && memberId && memberEmail) {
    return NextResponse.json(
      { ok: true, requestId: memberId, email: memberEmail },
      { status: 201 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
