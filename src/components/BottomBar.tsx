"use client";

import { AiFillGithub } from "react-icons/ai";
import { HiStar } from "react-icons/hi";

export default function CornerIcons() {
  return (
    <>
      {/* Left icon */}
      <a
        href="https://github.com/Byte-Developments/blobs.rest"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-125 transition"
      >
        <AiFillGithub size="30" />
      </a>

      {/* Right icon */}
      <a
        href="https://obliqua.design"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-125 transition"
      >
        <HiStar size="30" />
      </a>
    </>
  );
}
