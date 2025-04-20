"use client";
import { useEffect, useRef } from "react";

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.volume = 0.2;
      audio.play().catch(() => {});
    };

    window.addEventListener("click", tryPlay, { once: true });
    return () => window.removeEventListener("click", tryPlay);
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src="/ambient.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
}
