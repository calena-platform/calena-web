import { describe, it, expect } from "vitest";
import {
  validateRequest,
  buildInsertRow,
  CONSENT_WORDING_VERSION,
  SOURCE,
} from "@/lib/validation";

const base = {
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
};

describe("validateRequest", () => {
  it("accepts a minimal valid request and trims values", () => {
    const r = validateRequest({ ...base, first_name: "  Ada  " });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.first_name).toBe("Ada");
      expect(r.data.country).toBeNull();
      expect(r.data.referred_by).toBeNull();
      expect(r.data.consent_marketing).toBe(false);
    }
  });

  it("requires first name, last name, and email", () => {
    const r = validateRequest({});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.first_name).toBeDefined();
      expect(r.errors.last_name).toBeDefined();
      expect(r.errors.email).toBeDefined();
    }
  });

  it("rejects an email without a valid shape", () => {
    const r = validateRequest({ ...base, email: "ada-at-example" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeDefined();
  });

  it("enforces column length ceilings", () => {
    const r = validateRequest({
      ...base,
      first_name: "a".repeat(101),
      country: "c".repeat(101),
      referred_by: "r".repeat(201),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.first_name).toBeDefined();
      expect(r.errors.country).toBeDefined();
      expect(r.errors.referred_by).toBeDefined();
    }
  });

  it("accepts an email up to 320 chars and rejects beyond", () => {
    const local = "a".repeat(320 - "@example.com".length);
    const okEmail = `${local}@example.com`;
    expect(validateRequest({ ...base, email: okEmail }).ok).toBe(true);
    expect(validateRequest({ ...base, email: `x${okEmail}` }).ok).toBe(false);
  });

  it("only treats an explicit boolean true as consent", () => {
    expect(
      (validateRequest({ ...base, consent_marketing: true }) as { data: { consent_marketing: boolean } }).data
        .consent_marketing,
    ).toBe(true);
    for (const v of ["on", "true", 1, null, undefined]) {
      const r = validateRequest({ ...base, consent_marketing: v });
      expect(r.ok && r.data.consent_marketing).toBe(false);
    }
  });
});

describe("buildInsertRow", () => {
  const now = "2026-06-12T00:00:00.000Z";

  it("sets status=received, source, and omits consent fields without consent", () => {
    const r = validateRequest(base);
    if (!r.ok) throw new Error("expected valid");
    const row = buildInsertRow(r.data, now);
    expect(row.status).toBe("received");
    expect(row.source).toBe(SOURCE);
    expect(row.consent_marketing).toBe(false);
    expect(row).not.toHaveProperty("consent_at");
    expect(row).not.toHaveProperty("consent_wording_version");
  });

  it("records consent_at + wording version when consent is given (RLS contract)", () => {
    const r = validateRequest({ ...base, consent_marketing: true });
    if (!r.ok) throw new Error("expected valid");
    const row = buildInsertRow(r.data, now);
    expect(row.consent_marketing).toBe(true);
    expect(row.consent_at).toBe(now);
    expect(row.consent_wording_version).toBe(CONSENT_WORDING_VERSION);
    expect(CONSENT_WORDING_VERSION).toBe("threshold-2026-06-12");
  });

  it("passes optional fields through as null when absent", () => {
    const r = validateRequest(base);
    if (!r.ok) throw new Error("expected valid");
    const row = buildInsertRow(r.data, now);
    expect(row.country).toBeNull();
    expect(row.referred_by).toBeNull();
  });
});
