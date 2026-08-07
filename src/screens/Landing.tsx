import { Button } from "../ui";

interface Props {
  onPlay: () => void;
  onSkip: () => void;
}

const FEATURES = [
  { icon: "🪙", title: "Coins & Combos", desc: "Chain pipe passes for multiplying score. Collect coins for the shop." },
  { icon: "🌍", title: "4 Worlds", desc: "Meadow → Forest → Cosmos → Neon — each with unique visuals and hazards." },
  { icon: "⚡", title: "Power-Ups", desc: "Shield, Slow-Mo, Magnet, Frenzy — grab them mid-flight for an edge." },
  { icon: "🏆", title: "Cloud Leaderboard", desc: "Compete worldwide. Climb the ranks with your best runs." },
];

const CONTROLS = [
  { icon: "⬆️", label: "Space / Tap / Click", desc: "Flap to gain altitude" },
  { icon: "⏸️", label: "P / Esc", desc: "Pause the game" },
];

export default function Landing({ onPlay, onSkip }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <section className="relative flex flex-col items-center justify-center px-6 pb-8 pt-10">
        <div className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
          Open Source · MIT Licensed
        </div>
        <h1 className="mb-2 text-center text-4xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          🌿 Kush<span className="text-emerald-400">Cloud</span>
        </h1>
        <p className="mb-6 max-w-sm text-center text-sm leading-relaxed text-slate-300">
          A vibes-first flappy game with combos, worlds, power-ups, and a global leaderboard. Built entirely in the browser — zero external assets.
        </p>
        <Button onClick={onPlay} className="w-full max-w-xs py-4 text-lg shadow-emerald-500/30">
          ▶ PLAY
        </Button>
        <button
          onClick={onSkip}
          className="mt-3 text-xs text-slate-500 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          Skip to menu
        </button>
      </section>

      <section className="border-t border-white/5 bg-slate-900/50 px-6 py-8">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-slate-400">Features</h2>
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/5 bg-slate-800/60 p-3">
              <div className="mb-1 text-lg">{f.icon}</div>
              <div className="mb-0.5 text-xs font-bold text-white">{f.title}</div>
              <div className="text-[11px] leading-relaxed text-slate-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 px-6 py-8">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-slate-400">How to Play</h2>
        <div className="mx-auto max-w-sm space-y-2">
          {CONTROLS.map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <span className="text-lg">{c.icon}</span>
              <div>
                <div className="text-xs font-bold text-white">{c.label}</div>
                <div className="text-[11px] text-slate-400">{c.desc}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span className="text-lg">💨</span>
            <div>
              <div className="text-xs font-bold text-white">Smoke Clouds</div>
              <div className="text-[11px] text-slate-400">Fly through for a Red Eye score bonus</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-slate-900/50 px-6 py-8">
        <div className="mx-auto max-w-sm text-center">
          <a
            href="https://github.com/DLinacre/KushCloud#readme"
            target="_blank"
            rel="noreferrer"
            className="mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-slate-600 to-slate-700 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-slate-500 hover:to-slate-600"
          >
            ⭐ Star on GitHub
          </a>
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
            <a href="https://github.com/DLinacre/KushCloud/blob/main/docs/privacy-policy.md" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">Privacy</a>
            <a href="https://github.com/DLinacre/KushCloud/blob/main/docs/accessibility-statement.md" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">Accessibility</a>
          </div>
          <p className="mt-4 text-[10px] text-slate-600">
            Flappy Bird-style · React · TypeScript · Canvas 2D · Web Audio · Firebase
          </p>
        </div>
      </section>
    </div>
  );
}
