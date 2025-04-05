// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("500 Error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white text-center px-6">
      <div>
        <h1 className="text-4xl font-bold mb-4">500 – Something went wrong</h1>
        <p className="text-lg mb-6 opacity-70">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-semibold text-black bg-white rounded hover:bg-gray-100 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
