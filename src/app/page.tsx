"use client";

import { useState, useEffect } from "react";
import FallingBlobsCanvas from "@/components/FallingBlobsCanvas";
import AmbientAudio from "@/components/AmbientAudio";
import CentralText from "@/components/CentralText";

export default function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <FallingBlobsCanvas mouse={mouse} />
      <CentralText />
      <AmbientAudio />
    </>
  );
}
