import { getSocietaIndicator } from "./api_societa.js";

document.addEventListener("DOMContentLoaded", () => {
  const charts = {};

  const config = [
    { id: "fertilityChart", indicator: "fertility", label: "Tasso di fertilità" },
    { id: "lifeChart", indicator: "life_expectancy", label: "Aspettativa di vita" },
    { id: "mortalityChart", indicator: "mortality", label: "Mortalità infantile" },
    { id: "healthChartSoc", indicator: "health", label: "Spesa sanitaria pro capite" }
  ];

  config.forEach(cfg => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;

    loadSocietaChart(canvas, cfg.indicator, cfg.label, charts);
  });
});

async function loadSocietaChart(canvas, indicator, title, charts) {
  try {
    const data = await getSocietaIndicator(indicator);

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
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          borderColor: "rgba(255, 159, 64, 1)",
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
    console.error("Errore creazione grafico società:", err);
  }
}
