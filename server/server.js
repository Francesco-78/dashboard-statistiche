// server/server.js
import express from "express";
//import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static
app.use(express.static(path.join(__dirname, "..")));

// ----------------------
// MAPPING INDICATORI
// ----------------------

// Economia
const ECON_INDICATORS = {
  gdp: "NY.GDP.PCAP.CD",          // PIL pro capite
  population: "SP.POP.TOTL",      // Popolazione totale
  health: "SH.XPD.CHEX.PC.CD",    // Spesa sanitaria pro capite
  education: "IT.NET.USER.ZS"     // Utenti internet (% popolazione) come proxy "educazione"
};

// Società
const SOC_INDICATORS = {
  fertility: "SP.DYN.TFRT.IN",    // Tasso di fertilità
  life_expectancy: "SP.DYN.LE00.IN", // Aspettativa di vita
  mortality: "SP.DYN.IMRT.IN",    // Mortalità infantile
  health: "SH.XPD.CHEX.PC.CD"     // Spesa sanitaria pro capite
};

// ----------------------
// FUNZIONE GENERICA WORLD BANK
// ----------------------
async function fetchWorldBank(indicatorCode) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicatorCode}?format=json&per_page=20000`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Errore HTTP World Bank: ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
    throw new Error("Struttura dati World Bank inattesa");
  }

  // Prendiamo solo l'anno più recente disponibile per ogni paese
  const rows = data[1]
    .filter(d => d.country && d.country.value && d.value !== null)
    .map(d => ({
      country: d.country.value,
      value: Number(d.value),
      year: d.date
    }));

  return rows;
}

// ----------------------
// API ECONOMIA
// ----------------------
app.get("/api/economia/:indicator", async (req, res) => {
  try {
    const indicator = req.params.indicator;
    const code = ECON_INDICATORS[indicator];

    if (!code) {
      return res.status(404).json({ error: "Indicatore economia non trovato" });
    }

    const rows = await fetchWorldBank(code);
    res.json(rows);
  } catch (err) {
    console.error("Errore /api/economia:", err);
    res.status(500).json({ error: "Errore interno server economia" });
  }
});

// ----------------------
// API SOCIETÀ
// ----------------------
app.get("/api/societa/:indicator", async (req, res) => {
  try {
    const indicator = req.params.indicator;
    const code = SOC_INDICATORS[indicator];

    if (!code) {
      return res.status(404).json({ error: "Indicatore società non trovato" });
    }

    const rows = await fetchWorldBank(code);
    res.json(rows);
  } catch (err) {
    console.error("Errore /api/societa:", err);
    res.status(500).json({ error: "Errore interno server società" });
  }
});

// ----------------------
// AVVIO SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
