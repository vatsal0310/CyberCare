// ── Frontend Auth Helpers ─────────────────────────────────────

export const getToken = () => localStorage.getItem("cybercare_token");

export const getUser  = () => {
  const u = localStorage.getItem("cybercare_user");
  return u ? JSON.parse(u) : null;
};

export const logout = () => {
  localStorage.removeItem("cybercare_token");
  localStorage.removeItem("cybercare_user");
};

export const isLoggedIn = () => !!getToken();

// Attach JWT to any fetch call to protected tech routes
export const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
});