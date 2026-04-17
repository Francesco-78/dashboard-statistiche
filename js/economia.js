// ============================================================
// CONFIG
// ============================================================
const API_BASE = "http://localhost:3000/api/economia";
const chartsContainer = document.getElementById("chartsContainer");
let activeCharts = {};

// ============================================================
// FETCH DATI
// ============================================================
async function fetchIndicator(indicator) {
  try {
    const res = await fetch(`${API_BASE}/${indicator}`);
    return await res.json();
  } catch (err) {
    console.error("Errore fetch:", err);
    return null;
  }
}

// ============================================================
// CREA CARD + CANVAS
// ============================================================
function createChartCard(title, id) {
  const card = document.createElement("div");
  card.className = "chart-card fade-in";

  const canvas = document.createElement("canvas");
  canvas.id = id;

  card.appendChild(canvas);
  chartsContainer.appendChild(card);
}

// ============================================================
// CREA GRAFICO
// ============================================================
function renderChart(id, title, data) {
  const ctx = document.getElementById(id).getContext("2d");

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.values,
          backgroundColor: "rgba(106, 140, 175, 0.7)",
          borderColor: "rgba(106, 140, 175, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ============================================================
// CHECKBOX
// ============================================================
document.querySelectorAll(".chk input").forEach(chk => {
  chk.addEventListener("change", async () => {
    const indicator = chk.value;

    // RIMUOVI
    if (!chk.checked) {
      if (activeCharts[indicator]) {
        activeCharts[indicator].destroy();
        delete activeCharts[indicator];
      }
      chartsContainer.innerHTML = "";
      rebuildCharts();
      return;
    }

    // CREA
    const data = await fetchIndicator(indicator);

    if (!data || !data.labels || !data.values) {
      const empty = document.createElement("div");
      empty.className = "charts-empty";
      empty.textContent = `Nessun dato disponibile per ${indicator}.`;
      chartsContainer.appendChild(empty);
      return;
    }

    const id = `chart_${indicator}`;
    createChartCard(indicator, id);
    activeCharts[indicator] = renderChart(id, indicator, data);
  });
});

// ============================================================
// RICOSTRUZIONE GRAFICI
// ============================================================
async function rebuildCharts() {
  for (const indicator of Object.keys(activeCharts)) {
    const data = await fetchIndicator(indicator);
    const id = `chart_${indicator}`;
    createChartCard(indicator, id);
    activeCharts[indicator] = renderChart(id, indicator, data);
  }
}
