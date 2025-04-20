"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const tickRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState<number>(0.2);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

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

  useEffect(() => {
    if (!isPlaying || !audioRef.current || !canvasRef.current) return;

    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = newAudioCtx.createAnalyser();
    const source = newAudioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(newAudioCtx.destination);

    analyser.fftSize = 32; // fewer bars
    analyserRef.current = analyser;
    setAudioCtx(newAudioCtx);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      for (let i = 0; i < bufferLength; i += 2) {
        const x = i * barWidth;
        const h = (dataArray[i] / 255) * canvas.height;
        const gradient = ctx.createLinearGradient(x, canvas.height - h, x, canvas.height);
        gradient.addColorStop(0, "#ffa94d");
        gradient.addColorStop(1, "#ff7e5f");
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - h, barWidth - 2, h);
      }
    };

    canvas.width = 100;
    canvas.height = 20;
    render();

    return () => {
      analyser.disconnect();
      source.disconnect();
      newAudioCtx.close();
    };
  }, [isPlaying]);

  const fadeOutAndPause = (audio: HTMLAudioElement) => {
    const fade = () => {
      if (audio.volume > 0.05) {
        audio.volume = parseFloat((audio.volume - 0.05).toFixed(2));
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
      tickRef.current.volume = 0.2;
      tickRef.current.currentTime = 0;
      tickRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/bg_music.mp3" type="audio/mp3" />
      </audio>
      <audio ref={tickRef}>
        <source src="/click.mp3" type="audio/mp3" />
      </audio>
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`flex flex-col items-center gap-1 px-4 py-3 bg-black/40 rounded-full backdrop-blur-md shadow-md transition-all duration-300 ${expanded ? "w-[14rem]" : "w-auto"}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-transform duration-300 hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-transform duration-300 hover:scale-105"
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
                  className="ml-3 h-2 w-28 appearance-none bg-green-400/40 rounded-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-green-300 [&::-webkit-slider-thumb]:rounded-full"
                />
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="w-28 h-5" />
        </div>
      </div>
    </>
  );
}
