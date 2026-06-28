import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Post-Threshold DNA conversation → live anon-callable submit_lead_dna RPC.
// The RPC validates the request_id + email against an invitation_requests row
// in (received, invited) and upserts on (request_id, category, preference_key).
// Anon has EXECUTE; we keep the same server-route + IP rate-limit shape as the
// request handler. No DB internals are echoed to the client.

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

interface DnaAnswer {
  category: string;
  preference_key: string;
  preference_value: string;
  confidence?: number;
}

// Allowlist of the Bible §6 Q1–Q3 keys this conversation captures. A lead holds
// their own valid (request_id, email) pair, so without this they could upsert
// arbitrary preference rows for their own lead. Only these tuples are accepted;
// anything else is dropped before it reaches the RPC.
const ALLOWED_TUPLES = new Set<string>([
  "location/home_base_city",
  "travel/travel_style",
  "travel/travel_party",
  "entertainment/perfect_day",
]);

// Keep only well-formed, allowlisted, non-blank answers. Anything malformed or
// off-list is dropped rather than rejected — a partial conversation should still
// save what it can.
function sanitiseAnswers(input: unknown): DnaAnswer[] {
  if (!Array.isArray(input)) return [];
  const out: DnaAnswer[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const a = item as Record<string, unknown>;
    const category = typeof a.category === "string" ? a.category.trim() : "";
    const preference_key =
      typeof a.preference_key === "string" ? a.preference_key.trim() : "";
    const preference_value =
      typeof a.preference_value === "string" ? a.preference_value.trim() : "";
    if (!category || !preference_key || !preference_value) continue;
    if (!ALLOWED_TUPLES.has(`${category}/${preference_key}`)) continue;
    const confidence =
      typeof a.confidence === "number" && Number.isFinite(a.confidence)
        ? a.confidence
        : 1;
    out.push({ category, preference_key, preference_value, confidence });
  }
  return out;
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

  const b = (body ?? {}) as Record<string, unknown>;
  const requestId = typeof b.requestId === "string" ? b.requestId.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const answers = sanitiseAnswers(b.answers);

  if (!UUID_RE.test(requestId) || email.length < 1) {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  if (answers.length < 1) {
    return NextResponse.json(
      { ok: false, error: "Nothing to record." },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("submit_lead_dna", {
      p_request_id: requestId,
      p_email: email,
      p_answers: answers,
    });
    if (error) {
      // Don't leak DB internals to the client.
      console.error("submit_lead_dna failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "We could not record that just now." },
        { status: 502 },
      );
    }
    const written = typeof data === "number" ? data : answers.length;
    return NextResponse.json({ ok: true, written }, { status: 200 });
  } catch (err) {
    console.error("submit_lead_dna threw:", err);
    return NextResponse.json(
      { ok: false, error: "We could not record that just now." },
      { status: 502 },
    );
  }
}
