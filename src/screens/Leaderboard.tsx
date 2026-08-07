import { useCallback, useEffect, useState } from "react";
import { type SaveData, type TopRun } from "../game/storage";
import {
  getLeaderboard,
  getLocalLeaderboard,
  isCloudLeaderboardConfigured,
  submitScore,
  type LbEntry,
} from "../game/leaderboard";
import { Button, Panel, ScreenShell } from "../ui";

interface Props {
  save: SaveData;
  onBack: () => void;
}

function topRunsFromSave(save: SaveData): TopRun[] {
  return (save.topRuns || []).slice(0, 3);
}

export default function Leaderboard({ save, onBack }: Props) {
  const [entries, setEntries] = useState<LbEntry[]>(() => getLocalLeaderboard());
  const [playerRank, setPlayerRank] = useState<number>(0);
  const [source, setSource] = useState<"cloud" | "local">(isCloudLeaderboardConfigured() ? "cloud" : "local");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getLeaderboard(save.playerId, 50);
    setEntries(result.entries);
    setSource(result.source);
    setPlayerRank(result.playerRank || result.entries.findIndex((e) => e.uid === save.playerId) + 1);
    setError(result.error || "");
    setLoading(false);
  }, [save.playerId]);

  useEffect(() => {
    if (isCloudLeaderboardConfigured()) void load();
  }, [load]);

  // Live-ish board: refresh every 15s while the screen is open so a friend's
  // run shows up without leaving and re-entering the screen.
  useEffect(() => {
    if (!isCloudLeaderboardConfigured()) return;
    const timer = setInterval(() => void load(), 15_000);
    return () => clearInterval(timer);
  }, [load]);

  const submitBest = async () => {
    if (save.stats.bestScore <= 0) return;
    setLoading(true);
    const submitted = await submitScore({
      uid: save.playerId,
      name: save.playerName,
      score: save.stats.bestScore,
      totalGames: save.stats.totalGames,
      bestCombo: save.stats.bestCombo,
    });
    setError(submitted.error || "");
    await load();
  };

  const localRank = entries.findIndex((e) => e.name === save.playerName && e.score === save.stats.bestScore) + 1;
  const displayRank = playerRank || localRank;
  const topEntries = entries.slice(0, 50);
  const cloudConfigured = isCloudLeaderboardConfigured();
  const myTopRuns = topRunsFromSave(save);

  return (
    <ScreenShell title="Leaderboard" onBack={onBack}>
      <Panel className={`mb-4 ${source === "cloud" ? "border-sky-400/25 bg-sky-950/20" : "border-amber-400/20 bg-amber-950/20"}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {source === "cloud" ? "Online Leaderboard" : "Local Leaderboard"}
            </p>
            <p className="text-sm text-slate-300">
              {source === "cloud"
                ? "Live global rankings via Firebase."
                : cloudConfigured
                  ? "Cloud is unreachable, showing saved local scores."
                  : "Cloud not available; local scores still work."}
            </p>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${source === "cloud" ? "bg-sky-500/20 text-sky-200" : "bg-amber-500/20 text-amber-200"}`}>
            {loading ? "Syncing" : source}
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-amber-200">{error}</p>}
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" onClick={load} disabled={loading} className="flex-1 px-3 py-2 text-xs">
            Refresh
          </Button>
          <Button onClick={() => { void submitBest(); }} disabled={loading || save.stats.bestScore <= 0} className="flex-1 px-3 py-2 text-xs">
            Sync Best
          </Button>
        </div>
      </Panel>

      {save.stats.bestScore > 0 && (
        <Panel className="mb-4 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Your Rank</p>
          <p className="text-2xl font-bold text-emerald-400">
            #{displayRank > 0 ? displayRank : entries.length + 1}
          </p>
          <p className="text-sm text-slate-300">{save.playerName} — {save.stats.bestScore}</p>
        </Panel>
      )}

      {myTopRuns.length > 0 && (
        <Panel className="mb-4 border-emerald-700/30 bg-emerald-950/20">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">Your Top 3 Runs</p>
          <div className="space-y-1">
            {myTopRuns.map((run, i) => (
              <div key={`top-${i}-${run.score}`} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-1.5">
                <span className="text-sm font-bold text-emerald-300">#{i + 1}</span>
                <span className="text-sm text-white">{run.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="space-y-1">
        {topEntries.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            No scores yet. Play a game to set the first record!
          </p>
        )}
        {topEntries.map((entry, i) => {
          const rank = entry.rank || i + 1;
          const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
          const isPlayer = entry.uid ? entry.uid === save.playerId : entry.name === save.playerName;
          return (
            <div
              key={`${entry.uid || entry.name}-${entry.score}-${entry.date}`}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                isPlayer ? "border border-emerald-700/40 bg-emerald-900/30" : "bg-slate-800/30"
              }`}
            >
              <span className="w-8 text-center text-sm font-bold text-slate-400">{medal}</span>
              <div className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-bold ${isPlayer ? "text-emerald-300" : "text-white"}`}>
                  {entry.name}
                </span>
                {entry.redEye ? <span className="text-[10px] text-rose-300">👁 {entry.redEye} Red Eye</span> : null}
              </div>
              <span className="text-sm font-bold text-white">{entry.score.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </ScreenShell>
  );
}
