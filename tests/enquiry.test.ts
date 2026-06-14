import { describe, it, expect } from "vitest";
import {
  validateEnquiry,
  buildEnquiryRow,
  isEnquirySource,
  ENQUIRY_SOURCES,
} from "@/lib/validation";

describe("isEnquirySource", () => {
  it("accepts only partners and investor", () => {
    expect(isEnquirySource("partners")).toBe(true);
    expect(isEnquirySource("investor")).toBe(true);
    for (const v of ["calena.com.au", "", "Partners", null, undefined, 1]) {
      expect(isEnquirySource(v)).toBe(false);
    }
    expect(ENQUIRY_SOURCES).toEqual(["partners", "investor"]);
  });
});

describe("validateEnquiry — partners", () => {
  it("maps the partners form onto the table row", () => {
    const r = validateEnquiry("partners", {
      name: "Ada Lovelace",
      company: "Analytical Engines Ltd",
      email: "ada@example.com",
      country: "United Kingdom",
      vertical: "Private aviation",
      note: "We charter long-range jets across EMEA.",
      consent_marketing: true,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.first_name).toBe("Ada");
    expect(r.data.last_name).toBe("Lovelace");
    expect(r.data.email).toBe("ada@example.com");
    expect(r.data.country).toBe("United Kingdom");
    expect(r.data.referred_by).toBeNull(); // partners have no referrer field
    expect(r.data.source).toBe("partners");
    expect(r.data.consent_marketing).toBe(true);
    // company + vertical + note fold, labelled, into about
    expect(r.data.about).toBe(
      "Company: Analytical Engines Ltd\nVertical: Private aviation\nWe charter long-range jets across EMEA.",
    );
  });

  it("accepts a partners enquiry with only the required fields", () => {
    const r = validateEnquiry("partners", {
      name: "Madonna",
      email: "m@example.com",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.first_name).toBe("Madonna");
    expect(r.data.last_name).toBe("—"); // single-word name keeps a placeholder
    expect(r.data.about).toBeNull();
    expect(r.data.country).toBeNull();
    expect(r.data.consent_marketing).toBe(false);
  });
});

describe("validateEnquiry — investor", () => {
  it("maps the investor form onto the table row", () => {
    const r = validateEnquiry("investor", {
      name: "Grace Hopper",
      firm: "Cobol Capital",
      email: "grace@example.com",
      referred_by: "Introduced by a mutual LP",
      fit: "Pre-seed, A$250k, conviction in the category.",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.first_name).toBe("Grace");
    expect(r.data.last_name).toBe("Hopper");
    expect(r.data.referred_by).toBe("Introduced by a mutual LP");
    expect(r.data.country).toBeNull(); // no country field on the investor page
    expect(r.data.source).toBe("investor");
    expect(r.data.consent_marketing).toBe(false); // NDA ack only, never marketing
    expect(r.data.about).toBe(
      "Firm: Cobol Capital\nPre-seed, A$250k, conviction in the category.",
    );
  });
});

describe("validateEnquiry — validation", () => {
  it("requires a name and a valid email", () => {
    const r = validateEnquiry("partners", { name: "", email: "nope" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.name).toBeDefined();
    expect(r.errors.email).toBeDefined();
  });

  it("enforces the about ceiling once context is folded in", () => {
    const r = validateEnquiry("partners", {
      name: "Ada Lovelace",
      email: "ada@example.com",
      note: "x".repeat(2001),
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.about).toBeDefined();
  });

  it("ignores non-true consent values", () => {
    for (const v of ["on", "true", 1, null, undefined]) {
      const r = validateEnquiry("partners", {
        name: "Ada Lovelace",
        email: "ada@example.com",
        consent_marketing: v,
      });
      expect(r.ok && r.data.consent_marketing).toBe(false);
    }
  });
});

describe("buildEnquiryRow", () => {
  const now = "2026-06-15T00:00:00.000Z";

  it("writes the page source, about, and an RLS-safe received status", () => {
    const r = validateEnquiry("partners", {
      name: "Ada Lovelace",
      company: "Analytical Engines Ltd",
      email: "ada@example.com",
    });
    if (!r.ok) throw new Error("expected valid");
    const row = buildEnquiryRow(r.data, now);
    expect(row.source).toBe("partners");
    expect(row.status).toBe("received");
    expect(row.about).toBe("Company: Analytical Engines Ltd");
    expect(row.consent_marketing).toBe(false);
    // no consent → no consent columns (RLS consent-integrity)
    expect(row).not.toHaveProperty("consent_at");
    expect(row).not.toHaveProperty("consent_wording_version");
  });

  it("records consent_at + wording version when a partner opts in", () => {
    const r = validateEnquiry("investor", {
      name: "Grace Hopper",
      email: "grace@example.com",
      consent_marketing: true,
    });
    if (!r.ok) throw new Error("expected valid");
    const row = buildEnquiryRow(r.data, now);
    expect(row.source).toBe("investor");
    expect(row.consent_marketing).toBe(true);
    expect(row.consent_at).toBe(now);
    expect(row.consent_wording_version).toBe("threshold-2026-06-12");
  });
});
