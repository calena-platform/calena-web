"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

// Scroll reveal — mirrors the reference's IntersectionObserver grammar.
// The hidden start-state lives in CSS behind `html.js`, so server-rendered
// markup and no-JS / reduced-motion users always see content (no flash).
// Renders a single element with `reveal` merged onto the given className,
// so `<Reveal className="glass">` becomes `<div class="glass reveal">`.
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const merged = `${className} reveal`.trim();
  return (
    <Tag ref={ref} className={merged}>
      {children}
    </Tag>
  );
}
