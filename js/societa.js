// js/societa.js
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
