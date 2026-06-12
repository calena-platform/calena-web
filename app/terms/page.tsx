import type { Metadata } from "next";
import Link from "next/link";
import "../threshold.css";

export const metadata: Metadata = {
  title: "Terms — caléna",
  description: "The terms governing your use of caléna.",
  robots: { index: false, follow: true },
};

// Branded placeholder. Full terms of service land later — content owned by
// Kylie / compliance.
export default function TermsPage() {
  return (
    <main className="legal-page">
      <span className="eyebrow">Terms</span>
      <h1>By invitation, by agreement.</h1>
      <p>
        Our full terms of service are being finalised. Requesting an invitation
        places you under no obligation, and confers none — admission rests on
        consideration alone.
      </p>
      <p>
        For any question, write to{" "}
        <a href="mailto:contact@calena.com.au">contact@calena.com.au</a>.
      </p>
      <p>
        <Link href="/">Return to the threshold</Link>
      </p>
    </main>
  );
}
