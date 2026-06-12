import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimit, RATE_LIMIT } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("allows up to MAX_HITS within the window, then blocks", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < RATE_LIMIT.MAX_HITS; i++) {
      expect(rateLimit("1.2.3.4", t0).allowed).toBe(true);
    }
    expect(rateLimit("1.2.3.4", t0).allowed).toBe(false);
  });

  it("isolates counters per key", () => {
    const t0 = 2_000_000;
    for (let i = 0; i < RATE_LIMIT.MAX_HITS; i++) rateLimit("a", t0);
    expect(rateLimit("a", t0).allowed).toBe(false);
    expect(rateLimit("b", t0).allowed).toBe(true);
  });

  it("frees the budget once the window has passed", () => {
    const t0 = 3_000_000;
    for (let i = 0; i < RATE_LIMIT.MAX_HITS; i++) rateLimit("c", t0);
    expect(rateLimit("c", t0).allowed).toBe(false);
    expect(rateLimit("c", t0 + RATE_LIMIT.WINDOW_MS + 1).allowed).toBe(true);
  });
});
