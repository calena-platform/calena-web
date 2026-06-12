import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Guards that the committed .env.example keeps documenting the names the app
// needs (values always come from the deploy env — never committed).
describe(".env.example", () => {
  const contents = readFileSync(
    resolve(__dirname, "..", ".env.example"),
    "utf8",
  );

  it("documents the required Supabase variable names", () => {
    expect(contents).toContain("NEXT_PUBLIC_SUPABASE_URL=");
    expect(contents).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=");
  });

  it("documents the hero film flag", () => {
    expect(contents).toContain("NEXT_PUBLIC_HERO_FILM_ENABLED=");
  });

  it("never commits a real value", () => {
    // Every declared key must be empty or a safe literal (false), never a secret.
    const assignments = contents
      .split("\n")
      .filter((line) => /^[A-Z0-9_]+=/.test(line));
    for (const line of assignments) {
      const value = line.slice(line.indexOf("=") + 1).trim();
      expect(["", "false", "true"]).toContain(value);
    }
  });
});
