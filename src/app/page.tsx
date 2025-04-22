"use client";

import Link from "next/link";

const cards = [
  {
    title: "Comets Visual",
    href: "/comets",
    img: "/comets_preview.png",
  },
  {
    title: "Nebula Scene",
    href: "/nebula",
    img: "/nebula_preview.png",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 -z-30 bg-[#0a0a2a]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(#444_1px,_transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Blurred orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full top-1/4 left-[-10%] opacity-30 blur-[200px]" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-400 rounded-full bottom-1/4 right-[-10%] opacity-30 blur-[160px]" />
      </div>

      {/* Interactive layout */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <h1 className="text-[10vw] sm:text-7xl font-extrabold tracking-tight text-center mb-4 leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
          V I S U A L S
        </h1>
        <p className="text-white/70 text-lg sm:text-xl text-center max-w-2xl mb-12">
          Not just visuals — crafted ambient experiences. Which mood will you enter?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl w-full">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative rounded-xl border border-white/10 transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-sm shadow-xl hover:border-transparent hover:shadow-lg hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-purple-500/20"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-tr from-pink-400 to-purple-400 text-transparent bg-clip-text drop-shadow-md">
                    {card.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}