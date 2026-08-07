import { showToast } from "../ui";

const GAME_URL = "https://dlinacre.github.io/KushCloud/";

/**
 * Render a branded 1200×630 "score card" to a PNG blob for sharing.
 * A visual card massively out-performs plain text for the "beat my score" loop —
 * friends see the number, the brand, and the challenge in one glanceable image.
 */
async function renderScoreCard(score: number, isNewBest: boolean, rank?: number): Promise<Blob | null> {
  try {
    const W = 1200, H = 630;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return null;

    // Background — deep night gradient (matches theme #020617 → emerald glow)
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#020617");
    g.addColorStop(0.55, "#04121a");
    g.addColorStop(1, "#052e1f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Emerald radial glow top-right
    const rg = ctx.createRadialGradient(W * 0.82, H * 0.18, 40, W * 0.82, H * 0.18, 520);
    rg.addColorStop(0, "rgba(16,185,129,0.35)");
    rg.addColorStop(1, "rgba(16,185,129,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#a7f3d0";
    ctx.font = "700 42px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText("🌿 KushCloud", 72, 110);

    ctx.fillStyle = "#5eead4";
    ctx.font = "500 26px system-ui, sans-serif";
    ctx.fillText(isNewBest ? "NEW PERSONAL BEST" : "SCORE", 74, 250);

    // The big number
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 200px system-ui, sans-serif";
    ctx.fillText(String(score), 68, 430);

    // Rank line (if we know it)
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "500 30px system-ui, sans-serif";
    const challenge = rank
      ? `🏆 World rank #${rank} — think you can beat it?`
      : isNewBest
        ? "🔥 A new high — can your friends beat it?"
        : "Can you beat my score?";
    ctx.fillText(challenge, 74, 512);

    // URL chip
    ctx.fillStyle = "#34d399";
    ctx.font = "600 26px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText("dlinacre.github.io/KushCloud", 74, 566);

    return await new Promise((res) => c.toBlob((b) => res(b), "image/png"));
  } catch {
    return null;
  }
}

/**
 * Share the run. Tries native share WITH a generated image (best for virality on
 * mobile), then native text share, then clipboard — always with a "beat me" hook.
 */
export async function shareScore(score: number, isNewBest: boolean, rank?: number): Promise<boolean> {
  const rankText = rank ? ` (world rank #${rank})` : "";
  const text = isNewBest
    ? `🌿 I just scored ${score} in KushCloud${rankText} — a NEW PERSONAL BEST! Bet you can't beat it 😏`
    : `🌿 I scored ${score} in KushCloud${rankText}! Think you can beat me?`;

  // 1) Native share with the score-card image (the viral money path)
  try {
    const blob = await renderScoreCard(score, isNewBest, rank);
    if (blob && navigator.canShare) {
      const file = new File([blob], `kushcloud-${score}.png`, { type: "image/png" });
      const withFiles: ShareData = { title: "KushCloud", text, url: GAME_URL, files: [file] };
      if (navigator.canShare(withFiles)) {
        await navigator.share(withFiles);
        return true;
      }
    }
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return false;
  }

  // 2) Native text share
  const shareData: ShareData = { title: "KushCloud — Chill Arcade Flyer", text: `${text} ${GAME_URL}`, url: GAME_URL };
  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return false;
    }
  }

  // 3) Clipboard fallback
  try {
    await navigator.clipboard.writeText(`${text} ${GAME_URL}`);
    showToast("Score copied — go flex on your friends!", "success");
    return true;
  } catch {
    showToast("Could not share score", "error");
    return false;
  }
}
