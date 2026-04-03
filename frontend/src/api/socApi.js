// frontend/src/api/socApi.js
const BASE  = "http://localhost:8000/api";
const token = () => localStorage.getItem("cybercare_token") || "";
const auth  = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });
const json  = async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json(); };

export const socApi = {
  getLogs:      ()                    => fetch(`${BASE}/blue/logs`,          { headers: auth() }).then(json),
  respond:      (id, action)          => fetch(`${BASE}/blue/respond/${id}`, { method: "POST",   headers: auth(), body: JSON.stringify({ action }) }).then(json),
  reset:        ()                    => fetch(`${BASE}/blue/reset`,         { method: "DELETE", headers: auth() }).then(json),
  launchAttack: (attack_type, target) => fetch(`${BASE}/red/launch`,         { method: "POST",   headers: auth(), body: JSON.stringify({ attack_type, target }) }).then(json),
  launchChaos:  ()                    => fetch(`${BASE}/red/chaos`,          { method: "POST",   headers: auth() }).then(json),
};