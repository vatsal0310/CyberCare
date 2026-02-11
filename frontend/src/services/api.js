const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

// Password analyzer
export const analyzePassword = async (password) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // allow Render cold start

  try {
    const response = await fetch(`${API_URL}/analyze-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      signal: controller.signal
    });

    // Handle backend errors (404, 500, etc.)
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server Error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {

    // Render cold start timeout
    if (err.name === "AbortError") {
      throw new Error("Server is starting up. Please wait a few seconds and try again.");
    }

    throw err;

  } finally {
    clearTimeout(timeout);
  }
};
