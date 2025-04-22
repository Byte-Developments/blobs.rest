"use client";

import Head from "next/head";
import NeonCanvas from "@/components/NeonCanvas";
import DateDisplay from "@/components/DateDisplay";
import AmbientMusic from "@/components/AmbientMusic";

export default function Page() {
  return (
    <>
      <Head>
        <title>visuals rest - neon pipes</title>
        <meta name="description" content="animated neon pipes with a modern date widget for a calm ambient experience." />
        <meta name="keywords" content="neon pipes, relaxing animation, ambient canvas, nextjs visual, date display" />
      </Head>
      <main
        className="relative w-full h-screen bg-[#0a0a2a] overflow-hidden font-custom"
      >
        <AmbientMusic />
        <NeonCanvas />
        <DateDisplay />
      </main>
    </>
  );
}
