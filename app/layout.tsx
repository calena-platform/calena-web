import type { Metadata } from "next";
import { Syncopate, Montserrat } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "caléna — The World's First HNWI Operating System",
  description: "A private operating system for Ultra-High Net Worth Individuals. By invitation only.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syncopate.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
