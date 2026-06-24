// Server-side validation + insert-row construction for invitation requests.
// Pure functions — no I/O — so the rules are unit-tested in isolation.
// Mirrors the LIVE public.invitation_requests schema and its RLS contract
// (consent_marketing=true REQUIRES consent_at + consent_wording_version).

export const CONSENT_WORDING_VERSION = "threshold-2026-06-12";
export const SOURCE = "calena.com.au";

// Honeypot — a hidden field present in every intake form, off-screen and
// aria-hidden so no human (or screen-reader user) ever fills it. Bots that
// auto-fill every input populate it; a non-empty value means a bot. No real
// form field is named `website`, so a legitimate submission always leaves it
// blank. The handler silently accepts a flagged submission (so it cannot probe
// the difference) but never inserts it.
export const HONEYPOT_FIELD = "website";

export function isBotSubmission(input: unknown): boolean {
  const body = (input ?? {}) as Record<string, unknown>;
  const v = body[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}

// Column length ceilings, exactly as the live table enforces them.
// (about has no DB CHECK; we hold it to a sane ceiling server-side.)
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

  // Consent is opt-in: only an explicit boolean true counts. Anything else
  // (absent, "on", null) is treated as no consent — the request is still
  // accepted; consent governs marketing email only, not consideration.
  const consent_marketing = body.consent_marketing === true;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: { first_name, last_name, email, country, referred_by, consent_marketing },
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

// ---------------------------------------------------------------------------
// Enquiry path — the /partners and /invest pages.
//
// Both pages POST to the same /api/request handler with a `source` field. They
// share the live invitation_requests table (and its RLS contract) with the
// member Threshold, but their forms have a different shape: a single name field
// (split here into first/last), plus company/firm + vertical/fit context that
// has no dedicated column and so folds, labelled, into `about`. The source is
// written to the existing `source` column (no CHECK constraint — any text), so
// these enquiries are distinguishable from member requests downstream.
// ---------------------------------------------------------------------------

export const ENQUIRY_SOURCES = ["partners", "investor"] as const;
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];

export function isEnquirySource(value: unknown): value is EnquirySource {
  return value === "partners" || value === "investor";
}

export interface ValidatedEnquiry extends ValidatedRequest {
  about: string | null;
  source: EnquirySource;
}

// Fold the page's context fields into a single labelled `about` blob so nothing
// the enquirer told us is lost — there are no company/firm/vertical columns.
function composeAbout(
  source: EnquirySource,
  body: Record<string, unknown>,
): string {
  const lines: string[] = [];
  if (source === "partners") {
    const company = asString(body.company);
    const vertical = asString(body.vertical);
    const note = asString(body.note);
    if (company) lines.push(`Company: ${company}`);
    if (vertical) lines.push(`Vertical: ${vertical}`);
    if (note) lines.push(note);
  } else {
    const firm = asString(body.firm);
    const fit = asString(body.fit);
    if (firm) lines.push(`Firm: ${firm}`);
    if (fit) lines.push(fit);
  }
  return lines.join("\n");
}

export type EnquiryResult =
  | { ok: true; data: ValidatedEnquiry }
  | { ok: false; errors: Record<string, string> };

export function validateEnquiry(
  source: EnquirySource,
  input: unknown,
): EnquiryResult {
  const body = (input ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Single "name" field → first word is the given name, the remainder the
  // surname. A one-word name keeps an em-dash placeholder surname so the
  // length-1 / NOT-NULL DB checks pass without inventing a name.
  const name = asString(body.name);
  if (name.length < 1) errors.name = "Name is required.";
  else if (name.length > LIMITS.first_name + LIMITS.last_name + 1)
    errors.name = "Name is too long.";
  const parts = name.split(/\s+/).filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.length > 1 ? parts.slice(1).join(" ") : "—";

  const email = asString(body.email);
  if (email.length < 1) errors.email = "Email is required.";
  else if (email.length > LIMITS.email)
    errors.email = `Must be ${LIMITS.email} characters or fewer.`;
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  // Partners give a country/region; investors do not.
  const country =
    source === "partners"
      ? optional(body.country, LIMITS.country, "country", errors)
      : null;

  // Investors name who introduced them; partners have no referrer field.
  const referred_by =
    source === "investor"
      ? optional(body.referred_by, LIMITS.referred_by, "referred_by", errors)
      : null;

  const about = optional(
    composeAbout(source, body),
    LIMITS.about,
    "about",
    errors,
  );

  // Consent is opt-in and marketing-only — same rule as the Threshold form.
  // The investor page has no marketing checkbox (only an NDA acknowledgement),
  // so it never sends consent and this stays false.
  const consent_marketing = body.consent_marketing === true;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      first_name,
      last_name,
      email,
      country,
      referred_by,
      about,
      consent_marketing,
      source,
    },
  };
}

// Build the enquiry insert row: the Threshold row, plus the folded `about` and
// the page's own `source`. Same RLS-safe status + consent integrity as above.
export function buildEnquiryRow(
  data: ValidatedEnquiry,
  nowIso: string,
): Record<string, unknown> {
  const row = buildInsertRow(data, nowIso);
  row.source = data.source;
  row.about = data.about;
  return row;
}
