import { getToken } from "../services/auth";

const BASE = "http://127.0.0.1:8000/pcl";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function request(method, path, body = null) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Lab ──────────────────────────────────────────────────────
export const startLab      = (difficulty) => request("POST", "/lab/start", { difficulty });
export const getLabStatus  = (sessionId)  => request("GET",  `/lab/status/${sessionId}`);
export const resetLab      = ()           => request("POST", "/lab/reset");
export const getLabHint    = (sessionId)  => request("POST", `/lab/hint?session_id=${sessionId}`);
export const advanceStep   = (sessionId)  => request("POST", `/lab/step?session_id=${sessionId}`);

// ── Terminal ─────────────────────────────────────────────────
export const execTerminal  = (sessionId, command) =>
  request("POST", "/terminal/exec", { session_id: sessionId, command });

// ── Submission ───────────────────────────────────────────────
export const submitPassword = (sessionId, submittedPassword) =>
  request("POST", "/submission/submit", {
    session_id: sessionId,
    submitted_password: submittedPassword,
  });

// ── Overview & Difficulty ─────────────────────────────────────
export const getOverview     = () => request("GET", "/overview/");
export const getDifficulties = () => request("GET", "/difficulty/");

// ── Leaderboard ───────────────────────────────────────────────
export const getLeaderboard            = (limit = 10)                  => request("GET", `/leaderboard/top?limit=${limit}`);
export const getLeaderboardByDifficulty = (difficulty, limit = 10)     => request("GET", `/leaderboard/top?difficulty=${difficulty}&limit=${limit}`);
export const getMyLeaderboardPosition  = ()                            => request("GET", "/leaderboard/my-position");

// ── Analytics ─────────────────────────────────────────────────
export const getAnalytics = () => request("GET", "/analytics/me");
