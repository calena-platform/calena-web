import type { Metadata } from "next";
import Link from "next/link";
import "../threshold.css";

export const metadata: Metadata = {
  title: "Privacy — caléna",
  description: "How caléna collects, uses, and protects your information.",
  robots: { index: false, follow: true },
};

// Branded placeholder. Full privacy policy (APP 5 detail, processors, DSR
// process) lands later — content owned by Kylie / compliance.
export default function PrivacyPage() {
  return (
    <main id="main-content" className="legal-page">
      <span className="eyebrow">Privacy</span>
      <h1>Discretion is the architecture.</h1>
      <p>
        Our full privacy policy is being finalised. In the meantime: your
        details are collected by Caléna Pty Ltd to consider your request and,
        with your consent, to write to you. They are processed by our email and
        hosting providers, held securely, and never sold.
      </p>
      <p>
        For any question about your information, write to{" "}
        <a href="mailto:contact@calena.com.au">contact@calena.com.au</a>.
      </p>
      <p>
        <Link href="/">Return to the threshold</Link>
      </p>
    </main>
  );
}
