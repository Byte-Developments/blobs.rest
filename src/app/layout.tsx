import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neon Pipes Visual - Relax and Focus",
  description: "Animated neon pipes with a modern date widget for a calm ambient experience.",
  keywords: ["neon pipes", "ambient animation", "relaxing visual", "canvas", "Next.js SEO"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
