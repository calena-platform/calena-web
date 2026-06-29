// Transactional email for the off-app join flow (GL-J1).
//
// Resend is wired through its REST API (no SDK dependency) so the only secret is
// RESEND_API_KEY. Two hard rules from the build brief:
//   1. Sends stay DARK until the key is present. With no key, sendTemplate is a
//      graceful no-op — it never throws and never blocks the caller. This lets
//      the request flow ship before Geoff's Resend domain is verified.
//   2. Templates are the locked _email-templates-2026-06-29.html bodies, ported
//      verbatim (600px, table-based, fully inline-styled, text wordmark so
//      nothing breaks with images-off). Merge fields are {{key}} placeholders.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "caléna <concierge@calena.com.au>";

export type EmailTemplateName = "request-received" | "invitation-offer" | "seat-settled";

export interface SendResult {
  sent: boolean;
  skipped?: boolean; // true when no key is configured (intentional no-op)
  id?: string;
  error?: string;
}

type TemplateVars = Record<string, string>;

interface Template {
  subject: (vars: TemplateVars) => string;
  html: (vars: TemplateVars) => string;
}

// Escape merge values so a stray name/email can't break the markup or inject.
function esc(value: string | undefined): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Resolve {{key}} against escaped vars; an unknown key renders empty.
function fill(body: string, vars: TemplateVars): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => esc(vars[key]));
}

// ── Email 1 · Request received ────────────────────────────────────────────────
// Trigger: successful insert in /api/request (member branch). Automated. No
// price, no hard CTA — a warm acknowledgement that their name is forward.
const EMAIL_1_BODY = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;margin:0 auto;background:#031b28;border-collapse:collapse;">
    <tr><td style="height:56px;"></td></tr>
    <tr><td align="center" style="font-family:'Syncopate','Montserrat',Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:.42em;color:#fafafa;padding:0 40px;">caléna</td></tr>
    <tr><td align="center" style="padding:8px 40px 0;"><div style="width:34px;height:1px;background:#b5996f;margin:0 auto;"></div></td></tr>
    <tr><td align="center" style="font-family:'Cinzel',Georgia,serif;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#b5996f;padding:22px 40px 0;">The Threshold</td></tr>
    <tr><td style="font-family:'Montserrat',Arial,sans-serif;font-weight:300;font-size:16px;line-height:1.75;color:#fafafa;padding:26px 56px 0;">
      {{first_name}},
    </td></tr>
    <tr><td style="font-family:'Montserrat',Arial,sans-serif;font-weight:300;font-size:15px;line-height:1.85;color:#e9e6e0;padding:14px 56px 0;">
      Your name is now before us. caléna is invitation-only, and every name is considered personally — not by a queue. We&rsquo;ll be in touch shortly, quietly, when there is something to say.
    </td></tr>
    <tr><td style="font-family:'Montserrat',Arial,sans-serif;font-weight:300;font-size:15px;line-height:1.85;color:#e9e6e0;padding:16px 56px 0;">
      There is nothing for you to do in the meantime.
    </td></tr>
    <tr><td style="padding:30px 56px 0;"><div style="width:100%;height:1px;background:rgba(181,153,111,.22);"></div></td></tr>
    <tr><td style="font-family:'Montserrat',Arial,sans-serif;font-weight:300;font-size:12px;line-height:1.7;color:#8c8c8c;padding:16px 56px 0;">
      The caléna concierge
    </td></tr>
    <tr><td style="font-family:'Montserrat',Arial,sans-serif;font-weight:300;font-size:11px;line-height:1.7;color:#5f6b71;padding:24px 56px 52px;">
      caléna &middot; private membership &middot; Australia<br/>
      This message was sent to {{email}} because your name was put forward. If this wasn&rsquo;t you, simply disregard it.
    </td></tr>
  </table>`;

const TEMPLATES: Record<EmailTemplateName, Template> = {
  "request-received": {
    subject: () => "Your name is before us",
    html: (vars) => fill(EMAIL_1_BODY, vars),
  },
  // Emails 2 & 3 are registered in their own tasks (GL-J1b / GL-J1c).
  "invitation-offer": {
    subject: () => "An invitation",
    html: () => "",
  },
  "seat-settled": {
    subject: () => "Your seat is settled",
    html: () => "",
  },
};

/**
 * Send a locked transactional template via Resend.
 *
 * No-ops gracefully (returns { sent:false, skipped:true }) when RESEND_API_KEY is
 * absent, so callers can fire-and-forget without guarding for the pre-launch
 * window. Never throws — all failures are returned, not raised.
 */
export async function sendTemplate(
  name: EmailTemplateName,
  to: string,
  vars: TemplateVars,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Intentional: Resend domain not verified yet. Stay dark.
    return { sent: false, skipped: true };
  }

  const template = TEMPLATES[name];
  if (!template) {
    return { sent: false, error: `Unknown email template: ${name}` };
  }

  const from = process.env.CALENA_FROM_EMAIL || DEFAULT_FROM;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: template.subject(vars),
        html: template.html(vars),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { sent: false, error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, id: data.id };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
