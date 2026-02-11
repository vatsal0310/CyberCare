import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const analyzePassword = (password) =>
  API.post("/analyze-password", { password });
