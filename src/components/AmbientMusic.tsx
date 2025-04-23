"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const tickRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState<number>(0.2);
  const [mounted, setMounted] = useState(false);

  // mark client‐only
  useEffect(() => {
    if (typeof window !== "undefined") setMounted(true);
  }, []);

  // load saved volume + (optionally) auto‑play once
  useEffect(() => {
    if (!mounted) return;
    const stored = parseFloat(localStorage.getItem("ambient-volume") || "0.2");
    const audio = audioRef.current!;
    audio.volume = stored;
    setVolume(stored);

    
    const tryPlay = () => {
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
  }, [mounted]);

  // hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setVisible(true);
      clearTimeout((window as any)._hideTimeout);
      (window as any)._hideTimeout = setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // slider “tick” click
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const audio = audioRef.current!;
    audio.volume = newVol;
    setVolume(newVol);
    localStorage.setItem("ambient-volume", newVol.toString());

    const tick = tickRef.current;
    if (tick) {
      tick.volume = 0.2;
      tick.currentTime = 0;
      tick.play().catch(() => {});
    }
  };

  // one‑time graph & analyser setup
  function initAudioGraph(audio: HTMLAudioElement, canvas: HTMLCanvasElement) {
    const ctx2d = canvas.getContext("2d")!;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 32;
    analyserRef.current = analyser;

    const src = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const render = () => {
      requestAnimationFrame(render);
      analyser.getByteFrequencyData(data);
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const barW = canvas.width / 4;
      for (let i = 0; i < 4; i++) {
        const h = (data[i * 2] / 255) * canvas.height;
        ctx2d.fillStyle = "#ffa94d";
        ctx2d.fillRect(i * barW, canvas.height - h, barW - 3, h);
      }
    };
    render();
  }

  // fade out volume, pause element, then suspend graph
  const fadeOutAndPause = (audio: HTMLAudioElement) => {
    const fade = () => {
      if (audio.volume > 0.05) {
        audio.volume = parseFloat((audio.volume - 0.05).toFixed(2));
        requestAnimationFrame(fade);
      } else {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        localStorage.setItem("ambient-play", "false");
        audioCtxRef.current?.suspend();
      }
    };
    fade();
  };

  // on button click: init/resume or fade/suspend
  const toggleAudio = () => {
    const audio = audioRef.current!;
    const canvas = canvasRef.current!;
    if (audio.paused) {
      if (!audioCtxRef.current) {
        initAudioGraph(audio, canvas);
      }
      audioCtxRef.current!.resume().catch(() => {});
      audio.volume = volume;
      audio.play();
      setIsPlaying(true);
      localStorage.setItem("ambient-play", "true");
    } else {
      fadeOutAndPause(audio);
    }
  };

  if (!mounted) return null;
  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/bg_music.mp3" type="audio/mp3" />
      </audio>
      <audio ref={tickRef}>
        <source src="/click.mp3" type="audio/mp3" />
      </audio>
      <div
        className={`
          absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10
          text-white transition-opacity duration-500
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      >
        <div
          className={`
            flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full
            backdrop-blur-md shadow-md transition-all duration-300
            ${expanded ? "w-[20rem]" : "w-[12rem]"}
          `}
        >
          <button
            onClick={toggleAudio}
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20
                       transition-transform duration-300 hover:scale-105
                       cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20
                       transition-transform duration-300 hover:scale-105
                       cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <canvas
            ref={canvasRef}
            className="h-5 w-12"
            width={40}
            height={16}
          />
          {expanded && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="
                h-2 w-28 appearance-none bg-green-400/40 rounded-lg
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:bg-green-300
                [&::-webkit-slider-thumb]:rounded-full
                cursor-pointer
              "
            />
          )}
        </div>
      </div>
    </>
  );
}
