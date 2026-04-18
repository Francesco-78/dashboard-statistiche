// js/api_economia.js

const API_BASE_ECON = "/api/economia";

export async function getEconomiaIndicator(indicator) {
  try {
    const res = await fetch(`${API_BASE_ECON}/${indicator}`);

    if (!res.ok) {
      console.error("Errore HTTP economia:", res.status);
      return { labels: [], values: [] };
    }

    const raw = await res.json();

    if (!Array.isArray(raw)) {
      console.warn("Struttura dati economia inattesa:", raw);
      return { labels: [], values: [] };
    }

    const labels = raw.map(r => r.country || "N/D");
    const values = raw.map(r => Number(r.value) || 0);

    return { labels, values };
  } catch (err) {
    console.error("Errore fetch API Economia:", err);
    return { labels: [], values: [] };
  }
}
