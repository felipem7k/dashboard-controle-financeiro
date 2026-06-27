const routes = {
  inicio: {
    title: "Início"
  },
  transacoes: {
    title: "Transações"
  },
  mensalidades: {
    title: "Mensalidades"
  },
  cartao: {
    title: "Cartão"
  },
  assinaturas: {
    title: "Assinaturas"
  },
  ajustes: {
    title: "Ajustes"
  },
};

const items = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");

function navigate(route) {
  const id = routes[route] ? route : "inicio";

  items.forEach(item => {
    item.classList.toggle("is-active", item.dataset.route === id);
  });

  pages.forEach(page => {
    page.classList.toggle("is-visible", page.id === "page-" + id);
  });

  pageTitle.textContent = routes[id].title;
}

items.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const route = item.dataset.route;
    history.replaceState(null, "", "#" + route);
    navigate(route);
  });
});

navigate(location.hash.replace("#", "") || "inicio");

const gridColor = "#252a35";
const textColor = "#8a8f98";

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
