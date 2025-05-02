"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function DateDisplay() {
  const [dateInfo, setDateInfo] = useState({ day: "", date: "" });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    };
    const formatted = now.toLocaleDateString(undefined, options).split(", ");
    setDateInfo({
      day: formatted[0],
      date: formatted.slice(1).join(", ").toUpperCase(),
    });
  }, []);

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center
                   rounded-full bg-white/10 hover:bg-white/20 text-white
                   transition-transform duration-300 hover:scale-105 cursor-pointer"
      >
        <Calendar className="w-5 h-5" />
      </button>

      <div
        className={`
          absolute top-1/2 left-1/2 z-10 text-center text-white px-4 py-2
          pointer-events-none transition-opacity duration-500 ease-in-out
          ${visible ? "opacity-100" : "opacity-0"}
        `}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-widest drop-shadow-lg uppercase font-[Futurism]">
          {dateInfo.day}
        </h1>
        <h2 className="text-2xl md:text-3xl mt-2 text-gray-300 tracking-wide drop-shadow uppercase font-[Montserrat] font-medium">
          {dateInfo.date}
        </h2>
      </div>
    </>
  );
}
