"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const storedPlay = localStorage.getItem("ambient-play") === "true";
    const storedVolume = parseFloat(localStorage.getItem("ambient-volume") || "0.2");

    audio.volume = storedVolume;
    if (storedPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    const tryPlay = () => {
      if (storedPlay && audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener("click", tryPlay, { once: true });
    return () => window.removeEventListener("click", tryPlay);
  }, []);

  const fadeOutAndPause = (audio: HTMLAudioElement) => {
    const fade = () => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
        requestAnimationFrame(fade);
      } else {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        localStorage.setItem("ambient-play", "false");
      }
    };
    fade();
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = parseFloat(localStorage.getItem("ambient-volume") || "0.2");
      audio.play();
      setIsPlaying(true);
      localStorage.setItem("ambient-play", "true");
    } else {
      fadeOutAndPause(audio);
    }
  };

  const handleMouseMove = () => {
    setVisible(true);
    clearTimeout((window as any)._hideTimeout);
    (window as any)._hideTimeout = setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <audio ref={audioRef} loop onVolumeChange={(e) => {
        const target = e.target as HTMLAudioElement;
        localStorage.setItem("ambient-volume", target.volume.toString());
      }}>
        <source src="/bg_music.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white px-3 py-2 bg-black/40 rounded-full backdrop-blur-md shadow-md transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <button
          onClick={toggleAudio}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
}
