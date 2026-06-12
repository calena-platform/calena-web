import { NextResponse, type NextRequest } from "next/server";
import { validateRequest, buildInsertRow } from "@/lib/validation";
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

  const result = validateRequest(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  const row = buildInsertRow(result.data, new Date().toISOString());

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

  return NextResponse.json({ ok: true }, { status: 201 });
}
