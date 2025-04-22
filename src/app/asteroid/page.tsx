"use client";

import AmbientMusic from "@/components/AmbientMusic";
import DateDisplay from "@/components/DateDisplay";
import { useEffect, useRef } from "react";

export default function Page() {
  return (
    <>
      <Head>
        <title>visuals rest - asteroid view</title>
        <meta name="description" content="animated digital asteroids with a modern date widget for a calm ambient experience." />
        <meta name="keywords" content="asteroids, relaxing animation, ambient canvas, date display" />
      </Head>
      <main className="relative min-h-screen overflow-hidden">
        <AsteroidCanvas />
        <div className="absolute inset-0 flex items-center justify-center">
          <DateDisplay />
        </div>
        <AmbientMusic />
      </main>
    </>
  );
}
