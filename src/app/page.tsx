import { InteractiveBackground } from "@/components/InteractiveBackground";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      <InteractiveBackground />

      {/* Ana içerik */}
      <main className="relative text-center space-y-10 z-10">
        <h1 className="text-7xl font-light tracking-wider text-slate-200 animate-soft-fade-in">
          FLOPE
          <span className="block text-sm font-normal tracking-widest text-slate-400 mt-2">ENTERPRISE SOLUTIONS</span>
        </h1>
        <div className="space-y-4 backdrop-blur-sm bg-slate-900/30 p-10 rounded-lg border border-slate-700/30 shadow-xl animate-soft-fade-in-delayed">
          <p className="text-xl text-slate-300 font-light tracking-wide">
            © 2025 Doğukan Tevfik Sağıroğlu
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
