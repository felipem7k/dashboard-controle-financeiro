import { init as initInicio } from "./pages/inicio.js";
import { init as initTransacoes } from "./pages/transacoes.js";
import { init as initMensalidades } from "./pages/mensalidades.js";
import { init as initCartao } from "./pages/cartao.js";
import { init as initAssinaturas } from "./pages/assinaturas.js";
import { init as initAjustes } from "./pages/ajustes.js";
import { aplicarPerfil } from "./ui/perfil.js";

const routes = {
  inicio: {
    title: "Início",
    init: initInicio
  },
  transacoes: {
    title: "Transações",
    init: initTransacoes
  },
  mensalidades: {
    title: "Mensalidades",
    init: initMensalidades
  },
  cartao: {
    title: "Cartão",
    init: initCartao
  },
  assinaturas: {
    title: "Assinaturas",
    init: initAssinaturas
  },
  ajustes: {
    title: "Ajustes",
    init: initAjustes
  },
};

const items = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");
const loaded = new Set();

function navigate(route) {
  const id = routes[route] ? route : "inicio";
  const data = routes[id];

  items.forEach(item => {
    item.classList.toggle("is-active", item.dataset.route === id);
  });

  pages.forEach(page => {
    page.classList.toggle("is-visible", page.id === "page-" + id);
  });

  pageTitle.textContent = data.title;

  if (data.init && !loaded.has(id)) {
    data.init();
    loaded.add(id);
  }
}

items.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const route = item.dataset.route;
    history.replaceState(null, "", "#" + route);
    navigate(route);
  });
});

aplicarPerfil();
navigate(location.hash.replace("#", "") || "inicio");
