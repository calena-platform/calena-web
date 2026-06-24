import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live public stats, straight from the anon-callable, SECURITY-DEFINER
// public.get_public_stats() RPC (a read-only count over invitation_requests;
// exposes no rows). A thin pass-through: whatever the RPC returns is the live
// truth — never a hardcoded or fabricated figure. Cached briefly at the edge.
//
// NOTE: this endpoint is live but not yet consumed. The /invest page still
// carries a hardcoded "1,000+ requests" line; whether/how to surface the LIVE
// number there (and whether that prose figure is accurate) is a Geoff copy
// decision — see GEOFF-ON-RETURN. Wiring the render is a few minutes once set.
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_public_stats");
    if (error) {
      return NextResponse.json(
        { ok: false, error: "stats_unavailable" },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { ok: true, stats: data },
      {
        status: 200,
        headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
      },
    );
  } catch {
    // Env not configured (deploy gate) or transient.
    return NextResponse.json(
      { ok: false, error: "stats_unavailable" },
      { status: 502 },
    );
  }
}
