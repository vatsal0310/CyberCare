// frontend/src/api/sqliApi.js
// All SQLi lab endpoints — note the /api/sqli/ prefix
const BASE = "http://localhost:8000/api/sqli";

const getToken = () => localStorage.getItem("sqli_token") || "";
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const sqliApi = {
  challenge1Login:   (username, password, secure) => {
    const body = new URLSearchParams({ username, password, secure });
    return fetch(`${BASE}/challenge1/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", ...authHeader() }, body: body.toString() }).then(r => r.json());
  },
  challenge2Search:  (query)       => fetch(`${BASE}/challenge2/search?query=${encodeURIComponent(query)}`, { headers: authHeader() }).then(r => r.json()),
  challenge3Status:  (userId)      => fetch(`${BASE}/challenge3/status?user_id=${encodeURIComponent(userId)}`, { headers: authHeader() }).then(r => r.json()),
  challenge4Check:   (username)    => fetch(`${BASE}/challenge4/check_user?username=${encodeURIComponent(username)}`, { headers: authHeader() }).then(r => r.json()),
  challenge5Reset:   (email)       => fetch(`${BASE}/challenge5/reset_password?email=${encodeURIComponent(email)}`, { headers: authHeader() }).then(r => r.json()),
  challenge6Save:    (profileName) => {
    const body = new URLSearchParams({ profile_name: profileName });
    return fetch(`${BASE}/challenge6/set_profile`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", ...authHeader() }, body: body.toString() }).then(r => r.json());
  },
  challenge6View:    ()            => fetch(`${BASE}/challenge6/view_profile`, { headers: authHeader() }).then(r => r.json()),
  resetDatabase:     ()            => fetch(`${BASE}/reset`, { method: "POST" }).then(r => r.json()),
};

export const saveToken = (token, completed) => {
  if (token)     localStorage.setItem("sqli_token",     token);
  if (completed) localStorage.setItem("sqli_completed", JSON.stringify(completed));
};