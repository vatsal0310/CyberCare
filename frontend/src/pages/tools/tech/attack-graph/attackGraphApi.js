const BASE = "http://localhost:8000/attack-graph";

// ── Auth ─────────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("cybercare_token") || "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Base helpers ──────────────────────────────────────────────────────────────
const json = async (r) => {
  if (!r.ok) {
    const text = await r.text().catch(() => r.statusText);
    throw new Error(`${r.status}: ${text}`);
  }
  return r.json();
};

const get  = (url)       => fetch(url, { headers: authHeaders() }).then(json);
const post = (url, data) => fetch(url, { method: "POST",   headers: authHeaders(), body: JSON.stringify(data) }).then(json);
const del  = (url)       => fetch(url, { method: "DELETE", headers: authHeaders() }).then(json);

// ── Guard: throws early if scenario id is missing ─────────────────────────────
const requireId = (sid) => {
  if (!sid) throw new Error("No scenario id — scenario may not have loaded yet.");
};

// ── API ───────────────────────────────────────────────────────────────────────
export const api = {
  createScenario: (data)       => post(`${BASE}/scenarios`, data),
  getScenarios:   ()           => get(`${BASE}/scenarios`),
  deleteScenario: (id)         => del(`${BASE}/scenarios/${id}`),

  addAsset:       (sid, data)  => { requireId(sid); return post(`${BASE}/scenarios/${sid}/assets`, data); },
  getAssets:      (sid)        => { requireId(sid); return get(`${BASE}/scenarios/${sid}/assets`); },
  deleteAsset:    (id)         => del(`${BASE}/assets/${id}`),

  addConnection:  (sid, data)  => { requireId(sid); return post(`${BASE}/scenarios/${sid}/connections`, data); },
  getConnections: (sid)        => { requireId(sid); return get(`${BASE}/scenarios/${sid}/connections`); },

  analyze:        (sid)        => { requireId(sid); return post(`${BASE}/scenarios/${sid}/analyze`, {}); },
};