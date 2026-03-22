# calena.com.au — DNS Map

## Registrar vs DNS

- **Registrar:** Digital Pacific (domain registration only — do not make DNS changes here)
- **DNS provider:** Cloudflare — `dash.cloudflare.com` (account: dev@calena.com.au)
- **Nameservers:** `achiel.ns.cloudflare.com` / `lana.ns.cloudflare.com`

All DNS changes must be made in Cloudflare, not Digital Pacific or Wix.

## Current DNS Records

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | Vercel — calena-web project |
| CNAME | www | cname.vercel-dns.com | Vercel — www redirect |

## Vercel Domain Configuration

- Project: `calena-web` (under Geoff's projects team)
- Domains to add: `calena.com.au` and `www.calena.com.au`
- Vercel → calena-web → Settings → Domains

## Auth

- Magic link redirect: `https://calena.com.au/auth/callback`
- Supabase allowlist: add `https://calena.com.au/auth/callback` in Supabase → Auth → URL Configuration
- AASA served at: `https://calena.com.au/.well-known/apple-app-site-association`
