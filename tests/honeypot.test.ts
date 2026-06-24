import { describe, it, expect } from "vitest";
import { isBotSubmission, HONEYPOT_FIELD } from "@/lib/validation";

describe("isBotSubmission (honeypot)", () => {
  it("passes a human submission with no honeypot field", () => {
    expect(isBotSubmission({ first_name: "Ada", email: "a@b.co" })).toBe(false);
  });

  it("passes when the honeypot field is present but empty/whitespace", () => {
    expect(isBotSubmission({ [HONEYPOT_FIELD]: "" })).toBe(false);
    expect(isBotSubmission({ [HONEYPOT_FIELD]: "   " })).toBe(false);
  });

  it("flags a filled honeypot field as a bot", () => {
    expect(isBotSubmission({ [HONEYPOT_FIELD]: "http://spam.example" })).toBe(
      true,
    );
  });

  it("ignores non-string honeypot values (treats as human)", () => {
    expect(isBotSubmission({ [HONEYPOT_FIELD]: 123 })).toBe(false);
    expect(isBotSubmission({ [HONEYPOT_FIELD]: true })).toBe(false);
  });

  it("handles null/undefined input safely", () => {
    expect(isBotSubmission(null)).toBe(false);
    expect(isBotSubmission(undefined)).toBe(false);
  });
});
