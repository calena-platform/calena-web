"use client";

import { useEffect, useState } from "react";

// The hero film slot. Defaults to the animated-glass stand-in from the locked
// reference. The real 12–20s muted loop lands later — its <video> wiring
// (poster + static mobile fallback + reduced-motion fallback) is built here and
// gated behind a single env flag. Flag off (default) → stand-in ships.
const FILM_ENABLED = process.env.NEXT_PUBLIC_HERO_FILM_ENABLED === "true";

export default function HeroFilm() {
  return FILM_ENABLED ? <Film /> : <StandIn />;
}

// Animated-glass stand-in: layered bronze-on-navy field with two drifting
// blooms. The drift animation is pure CSS, stilled by prefers-reduced-motion.
function StandIn() {
  return (
    <>
      <div className="film" aria-hidden="true">
        <div className="drift d1" />
        <div className="drift d2" />
      </div>
      <div className="film-note">
        stand-in for the 12–20s muted film loop · real UI, graded dark
      </div>
    </>
  );
}

// Real-film branch. Renders the poster still on mobile or when motion is
// reduced; the muted autoplay loop otherwise. Assets (/hero.webm, /hero.mp4,
// /hero-poster.jpg) land with the commissioned film.
function Film() {
  const [mode, setMode] = useState<"poster" | "video">("poster");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");
    const decide = () =>
      setMode(reduce.matches || mobile.matches ? "poster" : "video");
    decide();
    reduce.addEventListener("change", decide);
    mobile.addEventListener("change", decide);
    return () => {
      reduce.removeEventListener("change", decide);
      mobile.removeEventListener("change", decide);
    };
  }, []);

  if (mode === "poster") {
    return (
      <div
        className="film"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/hero-poster.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div className="film" aria-hidden="true">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
