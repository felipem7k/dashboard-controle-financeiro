const gridColor = "#252a35";
const textColor = "#8a8f98";

export function init() {
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Entradas",
          data: [4000, 5000, 4500, 6000, 7000, 8000],
          backgroundColor: "#0466c8",
          borderRadius: 6
        },
        {
          label: "Saídas",
          data: [2500, 3000, 2800, 3200, 2900, 2650],
          backgroundColor: "#002855",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        }
      }
    }
  });

  new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Alimentação", "Moradia", "Transporte", "Lazer", "Outros"],
      datasets: [
        {
          data: [900, 800, 400, 300, 250],
          backgroundColor: ["#0466c8", "#0353a4", "#023e7d", "#002855", "#5c677d"],
          borderColor: "#13161c",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
            padding: 14
          }
        }
      }
    }
  });
}
