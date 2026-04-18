// js/economia.js
import { getEconomiaIndicator } from "./api_economia.js";

document.addEventListener("DOMContentLoaded", () => {
  const charts = {};

  const config = [
    { id: "gdpChart", indicator: "gdp", label: "PIL pro capite" },
    { id: "populationChart", indicator: "population", label: "Popolazione totale" },
    { id: "healthChart", indicator: "health", label: "Spesa sanitaria pro capite" },
    { id: "educationChart", indicator: "education", label: "Utenti internet (% popolazione)" }
  ];

  config.forEach(cfg => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;

    loadEconomiaChart(canvas, cfg.indicator, cfg.label, charts);
  });
});

async function loadEconomiaChart(canvas, indicator, title, charts) {
  try {
    const data = await getEconomiaIndicator(indicator);

    if (charts[indicator]) {
      charts[indicator].destroy();
    }

    charts[indicator] = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [{
          label: title,
          data: data.values,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { maxRotation: 90, minRotation: 45 } },
          y: { beginAtZero: true }
        }
      }
    });
  } catch (err) {
    console.error("Errore creazione grafico economia:", err);
  }
}
