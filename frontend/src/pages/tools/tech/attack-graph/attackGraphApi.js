const BASE = "http://localhost:8000/attack-graph";

const json = (r) => r.json();
const post = (url, data) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(json);
const del  = (url) => fetch(url, { method: "DELETE" }).then(json);

export const api = {
  createScenario:  (data)       => post(`${BASE}/scenarios`, data),
  getScenarios:    ()           => fetch(`${BASE}/scenarios`).then(json),
  deleteScenario:  (id)         => del(`${BASE}/scenarios/${id}`),
  addAsset:        (sid, data)  => post(`${BASE}/scenarios/${sid}/assets`, data),
  getAssets:       (sid)        => fetch(`${BASE}/scenarios/${sid}/assets`).then(json),
  deleteAsset:     (id)         => del(`${BASE}/assets/${id}`),
  addConnection:   (sid, data)  => post(`${BASE}/scenarios/${sid}/connections`, data),
  getConnections:  (sid)        => fetch(`${BASE}/scenarios/${sid}/connections`).then(json),
  analyze:         (sid)        => post(`${BASE}/scenarios/${sid}/analyze`, {}),
};