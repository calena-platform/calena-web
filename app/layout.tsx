import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://calena.com.au"),
  title: "caléna — The First HNWI Operating System",
  description:
    "Your entire life. One quiet place. A private operating system for the few — by invitation.",
  applicationName: "caléna",
  openGraph: {
    title: "caléna — The First HNWI Operating System",
    description: "Your entire life. One quiet place.",
    url: "https://calena.com.au",
    siteName: "caléna",
    locale: "en_AU",
    type: "website",
    images: [
      {
        // Placeholder OG image — final asset lands later.
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "caléna — The Threshold",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#031B28",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={fontVariables}>
      <head>
        {/*
          Mark JS as available before first paint, so the reveal hidden-state
          (gated behind html.js in CSS) only applies when motion can run.
          No-JS users and crawlers see fully-rendered content.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
