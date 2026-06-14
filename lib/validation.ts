// Server-side validation + insert-row construction for invitation requests.
// Pure functions — no I/O — so the rules are unit-tested in isolation.
// Mirrors the LIVE public.invitation_requests schema and its RLS contract
// (consent_marketing=true REQUIRES consent_at + consent_wording_version).

export const CONSENT_WORDING_VERSION = "threshold-2026-06-12";
export const SOURCE = "calena.com.au";

// Column length ceilings, exactly as the live table enforces them.
const LIMITS = {
  first_name: 100,
  last_name: 100,
  email: 320,
  country: 100,
  referred_by: 200,
  about: 2000,
} as const;

// Pragmatic email shape: a single @, no spaces, a dotted domain. The DB only
// requires an @; we hold the line a little tighter server-side.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidatedRequest {
  first_name: string;
  last_name: string;
  email: string;
  country: string | null;
  referred_by: string | null;
  about: string | null;
  consent_marketing: boolean;
}

export type ValidationResult =
  | { ok: true; data: ValidatedRequest }
  | { ok: false; errors: Record<string, string> };

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Optional free-text field → trimmed value, or null when blank/absent.
function optional(
  value: unknown,
  max: number,
  field: string,
  errors: Record<string, string>,
): string | null {
  const v = asString(value);
  if (v === "") return null;
  if (v.length > max) {
    errors[field] = `Must be ${max} characters or fewer.`;
    return null;
  }
  return v;
}

export function validateRequest(input: unknown): ValidationResult {
  const body = (input ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const first_name = asString(body.first_name);
  if (first_name.length < 1) errors.first_name = "First name is required.";
  else if (first_name.length > LIMITS.first_name)
    errors.first_name = `Must be ${LIMITS.first_name} characters or fewer.`;

  const last_name = asString(body.last_name);
  if (last_name.length < 1) errors.last_name = "Last name is required.";
  else if (last_name.length > LIMITS.last_name)
    errors.last_name = `Must be ${LIMITS.last_name} characters or fewer.`;

  const email = asString(body.email);
  if (email.length < 1) errors.email = "Email is required.";
  else if (email.length > LIMITS.email)
    errors.email = `Must be ${LIMITS.email} characters or fewer.`;
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  const country = optional(body.country, LIMITS.country, "country", errors);
  const referred_by = optional(
    body.referred_by,
    LIMITS.referred_by,
    "referred_by",
    errors,
  );

  const about = optional(body.about, LIMITS.about, "about", errors);

  // Consent is opt-in: only an explicit boolean true counts. Anything else
  // (absent, "on", null) is treated as no consent — the request is still
  // accepted; consent governs marketing email only, not consideration.
  const consent_marketing = body.consent_marketing === true;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: { first_name, last_name, email, country, referred_by, about, consent_marketing },
  };
}

// Build the exact row to insert. status is set to the only RLS-permitted value;
// source matches the table default. When consent is given, consent_at and the
// wording version MUST be set or the RLS policy rejects the insert; when it is
// not, those columns are left unset (null).
export function buildInsertRow(
  data: ValidatedRequest,
  nowIso: string,
): Record<string, unknown> {
  const row: Record<string, unknown> = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    country: data.country,
    referred_by: data.referred_by,
    about: data.about,
    consent_marketing: data.consent_marketing,
    status: "received",
    source: SOURCE,
  };

  if (data.consent_marketing) {
    row.consent_at = nowIso;
    row.consent_wording_version = CONSENT_WORDING_VERSION;
  }

  return row;
}
