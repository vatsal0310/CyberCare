const API_URL = import.meta.env.VITE_API_URL;

// Password analyzer
export const analyzePassword = async (password) => {
  const response = await fetch(`${API_URL}/analyze-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  return response.json();
};
