import Link from "next/link";
import HeroFilm from "@/components/HeroFilm";
import Reveal from "@/components/Reveal";
import RequestForm from "@/components/RequestForm";
import "./threshold.css";

// The Threshold — calena.com.au. Six beats, single scroll, by invitation.
// Copy is LOCKED (spec 2026-06-12) and reproduced verbatim. Scroll motion,
// the hero film stand-in, and the live form are layered in later commits.
export default function Home() {
  return (
    <>
      {/* 1 · THRESHOLD (hero) */}
      <header className="hero">
        <HeroFilm />
        <div className="wordmark">
          cal<span className="accent">é</span>na
        </div>
        <div className="hero-inner">
          <p className="eyebrow">The First HNWI Operating System</p>
          <h1>
            Your entire life.
            <br />
            One quiet place.
          </h1>
          <a className="cta" href="#ask">
            Request Your Invitation
          </a>
        </div>
        <div className="scroll-hint"></div>
      </header>

      <main id="main-content">
        {/* 2 · THE IDEA (manifesto) */}
        <section className="manifesto" aria-label="The idea">
          <div className="center">
            <Reveal className="block">
              <h3>What it is</h3>
              <p>
                One secure, intelligent place where your travel, your tables,
                your invitations, your estate, your people — <em>your entire
                life</em> — runs.
              </p>
            </Reveal>
            <Reveal className="block">
              <h3>What it ends</h3>
              <p>
                The threads, the portals, the phone calls, the repeating of
                yourself. Coordination disappears into the background,{" "}
                <em>where it belongs.</em>
              </p>
            </Reveal>
            <Reveal className="block">
              <h3>What it keeps</h3>
              <p>
                Your privacy. Your name never travels here — you hold a numeral
                instead, as the great houses always have. Discretion is not a
                setting — <em>it is the architecture.</em>
              </p>
            </Reveal>
          </div>
        </section>

        {/* 3 · THE NUMERAL */}
        <section className="numeral-sec" aria-label="The numeral">
          <Reveal>
            <div className="numeral">XII</div>
            <div className="hairline"></div>
            <p>
              A name is for the world. A numeral is for the few.
              <br />
              Founding members hold the first.
            </p>
          </Reveal>
        </section>

        {/* 4 · THE GLIMPSE */}
        <section aria-label="The glimpse">
          <div className="glimpse">
            <Reveal className="glimpse-head">
              <p className="eyebrow">A Glimpse</p>
            </Reveal>
            <div className="cards">
              <Reveal className="glass">
                <div className="ph" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <h4>The Summon</h4>
                <span>
                  CEIL arrives when called — frosted glass over whatever you
                  were doing, gone when you are done.
                </span>
              </Reveal>
              <Reveal className="glass">
                <div className="ph" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <h4>The Itinerary</h4>
                <span>
                  A week in Kyoto, assembled while you spoke. Every reservation
                  already holds your preferences.
                </span>
              </Reveal>
              <Reveal className="glass">
                <div className="ph" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <h4>The Invitation</h4>
                <span>
                  What reaches you was curated for you. RSVP, calendar,
                  arrangements — one gesture.
                </span>
              </Reveal>
            </div>
            <div className="glimpse-note">
              placeholder panels — production uses three real UI captures in
              liquid glass
            </div>
          </div>
        </section>

        {/* 5 · CEIL */}
        <section className="ceil-sec" aria-label="CEIL">
          <Reveal>
            <p className="line">
              “You were never meant to manage your life. Only to live it.”
            </p>
            <p className="who">Ceil · Your Concierge Intelligence</p>
          </Reveal>
        </section>

        {/* 6 · THE ASK */}
        <section className="ask" id="ask" aria-label="The ask">
          <Reveal className="center">
            <p className="eyebrow">By Invitation</p>
            <h2>Request yours.</h2>
          </Reveal>
          <Reveal>
            <RequestForm />
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="fm">
          cal<span style={{ color: "var(--bronze)" }}>é</span>na
        </div>
        <div className="legal">
          Caléna Pty Ltd · ABN [TODO-GEOFF]
          <br />
          <Link href="/privacy">Privacy</Link>·
          <Link href="/terms">Terms</Link>·
          <a href="mailto:contact@calena.com.au">contact@calena.com.au</a>
        </div>
      </footer>
    </>
  );
}
