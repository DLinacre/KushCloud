import { useState } from "react";
import { type SaveData } from "../game/storage";
import { randomName } from "../game/storage";
import { BUILD_INFO, buildDebugReport, shortCommit } from "../config/buildInfo";
import { Button, Panel, ScreenShell } from "../ui";

const REPO_URL = "https://github.com/DLinacre/KushCloud";

interface Props {
  save: SaveData;
  onBack: () => void;
  onChange: (patch: Partial<SaveData>) => void;
  onReset: () => void;
}

export default function Settings({ save, onBack, onChange, onReset }: Props) {
  const [nameInput, setNameInput] = useState(save.playerName);
  const [debugCopied, setDebugCopied] = useState(false);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim().slice(0, 16);
    if (trimmed && trimmed !== save.playerName) {
      onChange({ playerName: trimmed });
    }
  };

  const handleCopyDebug = async () => {
    const report = buildDebugReport({
      save: {
        version: save.version,
        coins: save.coins,
        stats: save.stats,
        equippedSkin: save.equippedSkin,
        equippedTrail: save.equippedTrail,
        equippedPowerUps: save.equippedPowerUps,
        ownedCounts: {
          skins: save.ownedSkins.length,
          trails: save.ownedTrails.length,
          powerUps: save.ownedPowerUps.length,
        },
      },
    });
    const text = JSON.stringify(report, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setDebugCopied(true);
      setTimeout(() => setDebugCopied(false), 1800);
    } catch {
      setDebugCopied(false);
      window.prompt("Copy debug report", text);
    }
  };

  return (
    <ScreenShell title="Settings" onBack={onBack}>
      <div className="space-y-4">
        <Panel>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-300">Player Name</h3>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={16}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="Enter name..."
            />
            <Button onClick={handleNameSubmit} className="px-3 py-2 text-xs">
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const newName = randomName();
                setNameInput(newName);
                onChange({ playerName: newName });
              }}
              className="px-3 py-2 text-xs"
            >
              Random
            </Button>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">Audio</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Music Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={save.musicVol}
                onChange={(e) => onChange({ musicVol: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">SFX Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={save.sfxVol}
                onChange={(e) => onChange({ sfxVol: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">Accessibility</h3>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={save.reducedMotion}
                onChange={(e) => onChange({ reducedMotion: e.target.checked })}
                className="accent-emerald-500"
              />
              <span className="text-sm text-slate-200">Reduced Motion</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={save.highContrast}
                onChange={(e) => onChange({ highContrast: e.target.checked })}
                className="accent-emerald-500"
              />
              <span className="text-sm text-slate-200">High Contrast Mode</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={!save.seenTutorial}
                onChange={(e) => onChange({ seenTutorial: !e.target.checked })}
                className="accent-emerald-500"
              />
              <span className="text-sm text-slate-200">Show Tutorial on Next Game</span>
            </label>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">Build & Deploy Debug</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <DebugRow label="Version" value={BUILD_INFO.version} />
            <DebugRow label="Commit" value={shortCommit()} />
            <DebugRow label="Branch" value={BUILD_INFO.branch} />
            <DebugRow label="Mode" value={BUILD_INFO.mode} />
            <DebugRow label="Base" value={BUILD_INFO.baseUrl} />
            <DebugRow label="Cloud LB" value={BUILD_INFO.leaderboardCloud ? "configured" : "local fallback"} />
            <DebugRow label="Built" value={BUILD_INFO.builtAt === "unknown" ? "unknown" : new Date(BUILD_INFO.builtAt).toLocaleString()} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={handleCopyDebug} className="flex-1 px-3 py-2 text-xs">
              {debugCopied ? "Copied!" : "Copy Debug Report"}
            </Button>
            <a
              href={`${BUILD_INFO.baseUrl}debug.json`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10"
            >
              Artifact
            </a>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">About</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              KushCloud is open-source and MIT licensed. Built with React, TypeScript, Canvas 2D, and Web Audio API — zero external assets.
            </p>
            <a
              href={`${REPO_URL}#readme`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-slate-600 to-slate-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-slate-500 hover:to-slate-600"
            >
              ⭐ Star on GitHub
            </a>
            <div className="flex gap-4 text-xs text-slate-400">
              <a href={`${REPO_URL}/blob/main/docs/privacy-policy.md`} target="_blank" rel="noreferrer" className="underline hover:text-slate-200">Privacy Policy</a>
              <a href={`${REPO_URL}/blob/main/docs/accessibility-statement.md`} target="_blank" rel="noreferrer" className="underline hover:text-slate-200">Accessibility</a>
            </div>
          </div>
        </Panel>

        <Panel>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">Data</h3>
          <Button variant="danger" onClick={onReset} className="w-full">
            Reset All Progress
          </Button>
        </Panel>
      </div>
    </ScreenShell>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-white/5 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="truncate font-mono text-slate-200" title={value}>{value}</div>
    </div>
  );
}
