"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CentralText() {
  const [word, setWord] = useState("BLOBS");

  useEffect(() => {
    const interval = setInterval(() => {
      setWord(prev => (prev === "BLOBS" ? "REST" : "BLOBS"));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={word}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className={`${word === 'BLOBS' ? 'bg-gradient-to-r from-[#DBE9F3] via-[#7392BA] to-[#2E5894]' : 'bg-gradient-to-r from-[#2E5894] via-[#7392BA] to-[#DBE9F3]'} bg-clip-text text-transparent text-[12vw] sm:text-[10vw] md:text-[8vw] font-extrabold tracking-wider drop-shadow-xl font-[Poppins]`}
        >
          {word}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
