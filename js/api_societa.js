// js/api_societa.js

const API_BASE_SOC = "/api/societa";

export async function getSocietaIndicator(indicator) {
  try {
    const res = await fetch(`${API_BASE_SOC}/${indicator}`);

    if (!res.ok) {
      console.error("Errore HTTP società:", res.status);
      return { labels: [], values: [] };
    }

    const raw = await res.json();

    if (!Array.isArray(raw)) {
      console.warn("Struttura dati società inattesa:", raw);
      return { labels: [], values: [] };
    }

    const labels = raw.map(r => r.country || "N/D");
    const values = raw.map(r => Number(r.value) || 0);

    return { labels, values };
  } catch (err) {
    console.error("Errore fetch API Società:", err);
    return { labels: [], values: [] };
  }
}
