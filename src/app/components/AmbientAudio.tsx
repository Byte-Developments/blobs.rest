import { useEffect, useRef } from "react";

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.2;
      audio.loop = true;
      audio.play().catch(() => {});
    }
  }, []);

  return <audio ref={audioRef} src="/ambient.mp3" preload="auto" />;
}
