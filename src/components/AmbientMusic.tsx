"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const tickRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState<number>(0.2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVolume = parseFloat(localStorage.getItem("ambient-volume") || "0.2");
      const audio = audioRef.current;
      if (audio) audio.volume = storedVolume;
      setVolume(storedVolume);

      if (localStorage.getItem("ambient-play") === "true") {
        audio?.play().then(() => setIsPlaying(true)).catch(() => {});
      }

      const tryPlay = () => {
        if (audio?.paused) {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };

      window.addEventListener("click", tryPlay, { once: true });
      return () => window.removeEventListener("click", tryPlay);
    }
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
        if (typeof window !== "undefined") {
          localStorage.setItem("ambient-play", "false");
        }
      }
    };
    fade();
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = volume;
      audio.play();
      setIsPlaying(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("ambient-play", "true");
      }
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = newVolume;
    setVolume(newVolume);
    if (typeof window !== "undefined") {
      localStorage.setItem("ambient-volume", newVolume.toString());
    }
    if (tickRef.current) {
      tickRef.current.currentTime = 0;
      tickRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/ambient.mp3" type="audio/mp3" />
      </audio>
      <audio ref={tickRef}>
        <source src="/sounds/tick.mp3" type="audio/mp3" />
      </audio>
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-black/40 rounded-full backdrop-blur-md shadow-md transition-all duration-300 ${expanded ? "w-52" : "w-auto"}`}
        >
          <button
            onClick={toggleAudio}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            {expanded && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="ml-3 h-2 w-28 appearance-none bg-white/30 rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
