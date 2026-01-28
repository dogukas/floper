"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import WaveBackground from "@/components/canvas/WaveBackground";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      <WaveBackground />

      {/* Ana içerik */}
      <main className="relative text-center space-y-10 z-10">
        <h1 ref={textRef} className="text-7xl font-light tracking-wider text-slate-200">
          FLOPE
          <span className="block text-sm font-normal tracking-widest text-slate-400 mt-2">ENTERPRISE SOLUTIONS</span>
        </h1>
        <div ref={contentRef} className="space-y-4 backdrop-blur-sm bg-slate-900/10 p-10 rounded-lg border border-slate-700/20 shadow-2xl">
          <p className="text-xl text-slate-300 font-light tracking-wide">
            © 2026 Doğukan Tevfik Sağıroğlu
          </p>
          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
          <p className="text-lg text-slate-400 tracking-wider uppercase">
            Full Stack Dev / DevOps
          </p>
        </div>
      </main>
    </div>
  );
}
