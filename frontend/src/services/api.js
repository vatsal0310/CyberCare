const API_URL = import.meta.env.VITE_API_URL;

// Password analyzer
export const analyzePassword = async (password) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_URL}/analyze-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      signal: controller.signal
    });

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};
