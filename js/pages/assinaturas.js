const assinaturas = [
  {
    nome: "Netflix",
    categoria: "Streaming",
    icone: "fa-solid fa-clapperboard",
    cor: "#E50914",
    valor: 55.9,
    ciclo: "mensal",
    renovacao: "12/jul",
    ordem: 12
  },
  {
    nome: "Spotify",
    categoria: "Música",
    icone: "fa-brands fa-spotify",
    cor: "#1DB954",
    valor: 21.9,
    ciclo: "mensal",
    renovacao: "05/jul",
    ordem: 5
  },
  {
    nome: "ChatGPT Plus",
    categoria: "IA",
    icone: "fa-solid fa-robot",
    cor: "#10A37F",
    valor: 110,
    ciclo: "mensal",
    renovacao: "20/jul",
    ordem: 20
  },
  {
    nome: "Amazon Prime",
    categoria: "Streaming",
    icone: "fa-brands fa-amazon",
    cor: "#FF9900",
    valor: 179,
    ciclo: "anual",
    renovacao: "28/ago",
    ordem: 59
  },
  {
    nome: "YouTube Premium",
    categoria: "Streaming",
    icone: "fa-brands fa-youtube",
    cor: "#FF0000",
    valor: 24.9,
    ciclo: "mensal",
    renovacao: "09/jul",
    ordem: 9
  },
  {
    nome: "Disney+",
    categoria: "Streaming",
    icone: "fa-brands fa-yahoo",
    cor: "#113CCF",
    valor: 33.9,
    ciclo: "mensal",
    renovacao: "15/jul",
    ordem: 15
  },
  {
    nome: "iCloud+",
    categoria: "Armazenamento",
    icone: "fa-brands fa-apple",
    cor: "#5c677d",
    valor: 99,
    ciclo: "anual",
    renovacao: "02/set",
    ordem: 64
  }
];

let filtroCiclo = "todas";
let busca = "";

function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function mensalEquivalente(assin) {
  return assin.ciclo === "anual" ? assin.valor / 12 : assin.valor;
}

function filtrar() {
  const termo = busca.trim().toLowerCase();
  return assinaturas.filter(assin => {
    const okCiclo = filtroCiclo === "todas" || assin.ciclo === filtroCiclo;
    const okBusca = assin.nome.toLowerCase().includes(termo);
    return okCiclo && okBusca;
  });
}

function atualizarResumo() {
  const totalMes = assinaturas.reduce((soma, a) => soma + mensalEquivalente(a), 0);

  document.getElementById("assin-total").textContent = "R$ " + formatar(totalMes);
  document.getElementById("assin-anual").textContent = "R$ " + formatar(totalMes * 12) + " por ano";

  const proxima = [...assinaturas].sort((a, b) => a.ordem - b.ordem)[0];
  document.getElementById("assin-proxima").textContent = proxima.nome;
  document.getElementById("assin-proxima-data").textContent = "Renova em " + proxima.renovacao;

  const cara = [...assinaturas].sort((a, b) => mensalEquivalente(b) - mensalEquivalente(a))[0];
  document.getElementById("assin-cara").textContent = cara.nome;
  document.getElementById("assin-cara-valor").textContent = "R$ " + formatar(mensalEquivalente(cara)) + "/mês";
}

function card(assin) {
  const ciclo = assin.ciclo === "anual" ? "Anual" : "Mensal";
  const unidade = assin.ciclo === "anual" ? "/ano" : "/mês";
  const classeBadge = assin.ciclo === "anual" ? "assin-badge anual" : "assin-badge";

  return `<div class="assin-card">
    <div class="assin-top">
      <span class="assin-icon" style="background: ${assin.cor}"><i class="${assin.icone}"></i></span>
      <div>
        <div class="assin-name">${assin.nome}</div>
        <div class="assin-cat">${assin.categoria}</div>
      </div>
    </div>
    <div class="assin-price">R$ ${formatar(assin.valor)} <span>${unidade}</span></div>
    <div class="assin-foot">
      <span class="assin-renew"><i class="fa-regular fa-calendar"></i> Renova em ${assin.renovacao}</span>
      <span class="${classeBadge}">${ciclo}</span>
    </div>
  </div>`;
}

function render() {
  const lista = filtrar();
  const grid = document.getElementById("assin-grid");

  if (lista.length === 0) {
    grid.innerHTML = `<div class="assin-empty">Nenhuma assinatura encontrada.</div>`;
  } else {
    grid.innerHTML = lista.map(card).join("");
  }

  atualizarResumo();
}

export function init() {
  document.getElementById("assin-tabs").addEventListener("click", e => {
    const botao = e.target.closest(".tx-tab");
    if (!botao) return;

    document.querySelectorAll("#assin-tabs .tx-tab").forEach(tab => {
      tab.classList.toggle("is-active", tab === botao);
    });

    filtroCiclo = botao.dataset.filter;
    render();
  });

  document.getElementById("assin-search-input").addEventListener("input", e => {
    busca = e.target.value;
    render();
  });

  render();
}
