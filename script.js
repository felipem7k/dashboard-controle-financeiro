const routes = {
  inicio: {
    title: "Início",
    desc: "Seus gráficos e estatísticas aparecerão aqui."
  },
  transacoes: {
    title: "Transações",
    desc: "Histórico de entradas e saídas aparecerá aqui."
  },
  mensalidades: {
    title: "Mensalidades",
    desc: "Suas contas recorrentes aparecerão aqui."
  },
  cartao: {
    title: "Cartão",
    desc: "Faturas e limites do cartão aparecerão aqui."
  },
  assinaturas: {
    title: "Assinaturas",
    desc: "Serviços e renovações aparecerão aqui."
  },
  ajustes: {
    title: "Ajustes",
    desc: "Preferências e configurações aparecerão aqui."
  },
};

const items = document.querySelectorAll(".nav-item");
const pageTitle = document.getElementById("page-title");
const content = document.getElementById("content");

function navigate(route) {
  const id = routes[route] ? route : "inicio";
  const data = routes[id];

  items.forEach(item => {
    item.classList.toggle("is-active", item.dataset.route === id);
  });

  pageTitle.textContent = data.title;
  content.innerHTML =
    `<div class="placeholder">
       <h2>${data.title} — em construção</h2>
       <p>${data.desc}</p>
     </div>`;
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
