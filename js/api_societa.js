// ============================================================
// API SOCIETÀ — Fetch + Normalizzazione
// ============================================================

const API_BASE = "http://localhost:3000/api/societa";

/**
 * Restituisce i dati normalizzati per un indicatore sociale.
 * Output garantito:
 * {
 *   labels: [...],
 *   values: [...]
 * }
 */
export async function getSocietaIndicator(indicator) {
  try {
    const res = await fetch(`${API_BASE}/${indicator}`);

    if (!res.ok) {
      console.error("Errore HTTP:", res.status);
      return emptyResult();
    }

    const raw = await res.json();

    // Controllo struttura
    if (!raw || !Array.isArray(raw)) {
      console.warn("Struttura dati inattesa:", raw);
      return emptyResult();
    }

    // Normalizzazione
    const labels = raw.map(r => r.country || r.label || "N/D");
    const values = raw.map(r => Number(r.value) || 0);

    return { labels, values };

  } catch (err) {
    console.error("Errore fetch API Società:", err);
    return emptyResult();
  }
}

/** Risultato vuoto */
function emptyResult() {
  return { labels: [], values: [] };
}
