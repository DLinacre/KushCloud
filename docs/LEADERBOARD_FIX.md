# 🏆 Leaderboard fix — why you & your friends can't see each other

## Diagnosis (verified 2026-07-13)
The cross-device leaderboard is **not working** because the Firebase Realtime
Database is locked. Direct tests against
`https://kushcloud-25cd5-default-rtdb.europe-west1.firebasedatabase.app` returned
**`Permission denied` (HTTP 401)** on both reads **and** writes.

Result: every device silently falls back to **localStorage** (device-only), so each
player only ever sees their own scores. Nothing reaches the cloud — it does not
"sync every so often," it never syncs at all.

Two problems were found:
1. **Security rules were never applied** → deny-all (the 401 above). *(Console fix — only you can do this.)*
2. **Code bug:** the score write was missing the `period` field that the rules
   require, so writes would fail validation even after the rules are applied.
   **✅ Fixed in this commit** (`src/config/firebase.ts` now writes `period: "all"`).

---

## ✅ The fix — apply the database rules (5 minutes, only you can do this)

The correct rules already exist in the repo at
[`docs/firebase-database.rules.json`](firebase-database.rules.json). They just need
to be pasted into the Firebase console.

1. Open **https://console.firebase.google.com/** → project **`kushcloud-25cd5`**.
2. Left sidebar → **Build → Realtime Database**.
3. Click the **Rules** tab.
4. **Replace everything** in the editor with the contents of
   `docs/firebase-database.rules.json` (open that file, copy all, paste).
5. Click **Publish**.

That's it. The rules:
- allow **public read** of `/leaderboards/*` (so everyone sees the board),
- allow **validated writes** per player (score bounded 0–100,000, name ≤32 chars,
  monotonic — you can't lower someone's score, unknown fields rejected),
- index by `score` for fast ordering,
- keep the database root **deny-by-default** everywhere else.

### Verify it worked (paste into a terminal after publishing)
```bash
DB="https://kushcloud-25cd5-default-rtdb.europe-west1.firebasedatabase.app"
# Read should now return {} or data, NOT "Permission denied":
curl -s "$DB/leaderboards/all.json?orderBy=%22score%22&limitToLast=5"
```
If you see `{ }` or real entries (not `Permission denied`), it's live. Then play a
run on two devices — you should see each other within a few seconds (the board
re-fetches when the Leaderboard screen opens / after a run submits).

---

## Notes & options

- **The Firebase web keys in the client are safe to be public** — that's normal for
  Realtime Database; the *rules* are the security boundary (now validated).
- **Docs drift:** `docs/ONLINE_LEADERBOARD.md` describes a Cloudflare D1 Worker as
  the intended backend, but the shipped code uses Firebase and the Worker is not
  deployed (`VITE_LEADERBOARD_API_URL` is unset). You have two clean options:
  - **A) Stay on Firebase (fastest):** just publish the rules above. Done.
  - **B) Switch to the Cloudflare Worker:** deploy `cloudflare/leaderboard-worker.js`
    per `docs/ONLINE_LEADERBOARD.md`, then set the GitHub repo **variable**
    `VITE_LEADERBOARD_API_URL` to the Worker URL (the deploy workflow already wires
    it in). The API path takes priority over Firebase in `getLeaderboard()`.
  Pick **one** to avoid confusion. Recommendation: **A** for now (zero deploy).
- **Refresh cadence:** the board is fetched on the Leaderboard screen and after a
  run submits — it's not a live socket. If you want auto-refresh, add a
  `setInterval(refetch, 15000)` on the Leaderboard screen (optional).

Once the rules are published, cross-device leaderboards work immediately — no app
redeploy required (the code fix here just ensures writes pass validation).

---

## ⚡ One-click option (recommended): publish rules via GitHub Actions

The repo now ships a ready-made workflow: **Actions → "Publish Firebase
Rules" → Run workflow**.

Setup once (~2 minutes):
1. `npm i -g firebase-tools` then `firebase login:ci` → prints a token.
2. GitHub → Settings → Secrets and variables → Actions → **New secret**:
   `FIREBASE_TOKEN` = that token.
3. Run the workflow. Done — rules are live, leaderboard works.

(Requires GitHub Actions to be unblocked on this account first — see Step 1
above; the same billing fix unblocks the game's deploys too.)
