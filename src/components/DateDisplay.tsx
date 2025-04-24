"use client";

import { useEffect, useState } from "react";

export default function DateDisplay() {
  const [dateInfo, setDateInfo] = useState({ day: "", date: "" });

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
    <div
      className="absolute top-1/2 left-1/2 z-10 text-center text-white px-4 py-2 animate-fadeinout pointer-events-none"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <h1 className="text-6xl md:text-8xl font-black tracking-widest drop-shadow-lg uppercase font-[Futurism]">
        {dateInfo.day}
      </h1>
      <h2 className="text-2xl md:text-3xl mt-2 text-gray-300 tracking-wide drop-shadow uppercase font-[Montserrat] font-medium">
        {dateInfo.date}
      </h2>
    </div>
  );
}
