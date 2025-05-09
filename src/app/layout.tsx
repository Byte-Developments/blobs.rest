import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "visuals rest - modern experiences",
  description: "animated visuals for a calm ambient experience.",
  keywords: ["visuals rest", "neon animation", "pipes animation", "ambient animation", "relaxing visual", "nebula", "nebula animation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
