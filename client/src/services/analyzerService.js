const API_URL = import.meta.env.VITE_API_URL
export const analyzeRepository = async (repoUrl, mode) => {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repoUrl, mode }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze repository");
  }

  return data;
};
