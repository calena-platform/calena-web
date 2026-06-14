"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

// Beat 6 — the ask. Posts to the /api/request route handler, which validates
// server-side and inserts into Supabase. Consent is unbundled and unchecked by
// default; submitting without it is still accepted (consent governs marketing
// email only, not consideration of the request). Success copy is locked.
export default function RequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      first_name: String(data.get("first_name") ?? ""),
      last_name: String(data.get("last_name") ?? ""),
      email: String(data.get("email") ?? ""),
      country: String(data.get("country") ?? ""),
      referred_by: String(data.get("referred_by") ?? ""),
      about: String(data.get("about") ?? ""),
      consent_marketing: data.get("consent_marketing") === "on",
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const json = (await res.json().catch(() => null)) as
        | { error?: string; errors?: Record<string, string> }
        | null;
      const firstFieldError = json?.errors
        ? Object.values(json.errors)[0]
        : undefined;
      setErrorMessage(
        json?.error ??
          firstFieldError ??
          "Something went amiss. Please try again.",
      );
      setStatus("error");
    } catch {
      setErrorMessage("We could not reach the house. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="considered" style={{ display: "block" }} role="status">
        Your request is being considered.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="first_name">First name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="last_name">Last name</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          autoComplete="country-name"
        />
      </div>
      <div className="field">
        <label htmlFor="referred_by">
          Who, if anyone, sent you?{" "}
          <span className="optional">— optional</span>
        </label>
        <input id="referred_by" name="referred_by" type="text" />
      </div>
      <div className="field">
        <label htmlFor="about">
          Anything that helps us understand you — a link, or a few words{" "}
          <span className="optional">— optional</span>
        </label>
        <input id="about" name="about" type="text" />
      </div>
      <div className="consent">
        <input type="checkbox" id="consent_marketing" name="consent_marketing" />
        <label htmlFor="consent_marketing">
          Send me caléna’s private correspondence — occasional, considered,
          easily ended.
        </label>
      </div>
      <p className="app5">
        Your details are collected by Calena Pty Ltd to consider your request
        and, with your consent, to write to you. They are processed by our email
        and hosting providers and never sold. Without them we cannot consider
        your request. <Link href="/privacy">Privacy</Link>
      </p>
      {status === "error" && errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div className="submit-wrap">
        <button className="cta" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending" : "Request Your Invitation"}
        </button>
      </div>
    </form>
  );
}
