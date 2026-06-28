"use client";

import { useState } from "react";

// A short, calm DNA conversation shown once a request is recorded. Three quiet
// questions (Bible §6 Q1–Q3); the fourth lives in the iOS app. Every step is
// skippable — skipped answers are simply omitted. Answered items are written to
// the live submit_lead_dna RPC via /api/dna. caléna register: no exclamation,
// no emoji, one thought at a time.

interface DnaAnswer {
  category: string;
  preference_key: string;
  preference_value: string;
  confidence: number;
}

// EXACT iOS enum rawValues — stored verbatim so the answers drive the app after
// the member joins. The helper subtitle may be friendlier; the value may not.
const TRAVEL_STYLES = [
  "Iconic Luxury",
  "Undiscovered",
  "Cultural Depth",
  "Adventure",
] as const;

const TRAVEL_PARTIES = ["Solo", "Partner", "Family", "Groups"] as const;

type Step = 0 | 1 | 2;
type Phase = "asking" | "saving" | "done" | "error";

export default function DnaConversation({
  requestId,
  email,
}: {
  requestId: string;
  email: string;
}) {
  const [step, setStep] = useState<Step>(0);
  const [phase, setPhase] = useState<Phase>("asking");

  // Q1
  const [home, setHome] = useState("");
  // Q2
  const [travelStyle, setTravelStyle] = useState<string | null>(null);
  const [travelParty, setTravelParty] = useState<string | null>(null);
  // Q3
  const [perfectDay, setPerfectDay] = useState("");

  function buildAnswers(): DnaAnswer[] {
    const answers: DnaAnswer[] = [];
    const homeValue = home.trim();
    if (homeValue) {
      answers.push({
        category: "location",
        preference_key: "home_base_city",
        preference_value: homeValue,
        confidence: 1,
      });
    }
    if (travelStyle) {
      answers.push({
        category: "travel",
        preference_key: "travel_style",
        preference_value: travelStyle,
        confidence: 1,
      });
    }
    if (travelParty) {
      answers.push({
        category: "travel",
        preference_key: "travel_party",
        preference_value: travelParty,
        confidence: 1,
      });
    }
    const dayValue = perfectDay.trim();
    if (dayValue) {
      answers.push({
        category: "entertainment",
        preference_key: "perfect_day",
        preference_value: dayValue,
        confidence: 1,
      });
    }
    return answers;
  }

  function advance() {
    if (step < 2) {
      setStep((s) => (s + 1) as Step);
      return;
    }
    void finish();
  }

  async function finish() {
    const answers = buildAnswers();
    // Nothing offered — no call, just a quiet close.
    if (answers.length === 0) {
      setPhase("done");
      return;
    }

    setPhase("saving");
    try {
      const res = await fetch("/api/dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, email, answers }),
      });
      if (res.ok) {
        setPhase("done");
        return;
      }
      setPhase("error");
    } catch {
      setPhase("error");
    }
  }

  if (phase === "done") {
    return (
      <p className="dna-done" role="status">
        Noted. I&rsquo;ll have it ready for you.
      </p>
    );
  }

  if (phase === "error") {
    return (
      <p className="dna-done" role="status">
        I couldn&rsquo;t save that just now — it&rsquo;s not lost; you can tell
        me in the app.
      </p>
    );
  }

  const saving = phase === "saving";
  const isLast = step === 2;

  return (
    <div className="dna">
      <p className="dna-progress">{step + 1} of 3</p>

      {step === 0 ? (
        <div className="dna-group">
          <p className="dna-voice">Where do you call home?</p>
          <p className="dna-helper">
            So I know the hours you keep, and where to begin.
          </p>
          <div className="field" style={{ marginBottom: 0 }}>
            <input
              type="text"
              aria-label="Where do you call home"
              autoComplete="off"
              value={home}
              onChange={(e) => setHome(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <>
          <p className="dna-voice">How do you like to travel?</p>
          <p className="dna-helper">
            A sense of it is enough — I&rsquo;ll learn the rest.
          </p>
          <div className="dna-group">
            <p className="dna-sub">The journey</p>
            <div className="dna-chips" role="group" aria-label="Travel style">
              {TRAVEL_STYLES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`dna-chip${travelStyle === value ? " selected" : ""}`}
                  aria-pressed={travelStyle === value}
                  onClick={() =>
                    setTravelStyle((cur) => (cur === value ? null : value))
                  }
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="dna-group">
            <p className="dna-sub">In whose company</p>
            <div className="dna-chips" role="group" aria-label="Travel party">
              {TRAVEL_PARTIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`dna-chip${travelParty === value ? " selected" : ""}`}
                  aria-pressed={travelParty === value}
                  onClick={() =>
                    setTravelParty((cur) => (cur === value ? null : value))
                  }
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <div className="dna-group">
          <p className="dna-voice">Describe a perfect day.</p>
          <p className="dna-helper">
            In your own words. There is no wrong answer.
          </p>
          <textarea
            aria-label="Describe a perfect day"
            rows={4}
            value={perfectDay}
            onChange={(e) => setPerfectDay(e.target.value)}
          />
        </div>
      ) : null}

      <div className="dna-actions">
        <button
          type="button"
          className="dna-skip"
          onClick={advance}
          disabled={saving}
        >
          Skip
        </button>
        <button
          type="button"
          className="cta"
          onClick={advance}
          disabled={saving}
        >
          {saving ? "Saving" : isLast ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
