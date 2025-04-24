"use client";

import AmbientMusic from "@/components/AmbientMusic";
import DateDisplay from "@/components/DateDisplay";
import StarCanvas from "@/components/StarCanvas";
import { useEffect, useRef } from "react";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>visuals rest - star visual</title>
        <meta name="description" content="animated digital star-shapes with a modern date widget for a calm ambient experience." />
        <meta name="keywords" content="stars, relaxing animation, ambient canvas, date display" />
      </Head>
      <main className="relative min-h-screen overflow-hidden">
        <StarCanvas />
        <div className="absolute inset-0 flex items-center justify-center">
          <DateDisplay />
        </div>
        <AmbientMusic />
      </main>
    </>
  );
}
