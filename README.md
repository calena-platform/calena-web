# calena-web — The Threshold

caléna's public landing page: `calena.com.au`. A single, static-first scroll —
six beats, by invitation, no scarcity. Built to the locked spec and visual
reference (2026-06-12).

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind v4** (design tokens in `app/globals.css`)
- **Self-hosted fonts** via `next/font` — Montserrat, Cinzel, Lora, Cormorant
  Garamond, Syncopate. No runtime third-party font requests.
- **Vitest** + Testing Library
- Form → server route handler → Supabase `public.invitation_requests`

No analytics, no trackers, no third-party SDKs. Privacy is the architecture.

## Design law (bible §5)

- Navy `#031B28` is the only true background.
- Bronze `#B5996F` is matte — hairlines and accents only, never a gradient.
- Off-white `#FAFAFA` is text.
- Cinzel letterspaced eyebrows · ONE Lora-italic CEIL line · Cormorant numeral ·
  Syncopate wordmark only · everything else Montserrat (Light for house blocks).
- `prefers-reduced-motion` is respected everywhere.
- No scarcity language anywhere — no caps, counts, timers, "limited".

## Local development

```bash
npm install
cp .env.example .env.local   # fill from Vercel project settings — never commit real values
npm run dev
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint` ·
`npm run test`.

## Environment

See `.env.example`. The publishable Supabase key is INSERT-only on
`public.invitation_requests` (anon cannot read rows). The hero ships as the
animated-glass stand-in; the real film loop is gated behind
`NEXT_PUBLIC_HERO_FILM_ENABLED`.
