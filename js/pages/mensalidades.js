const icones = {
  Moradia: "fa-house",
  Saúde: "fa-dumbbell",
  Internet: "fa-wifi",
  Energia: "fa-bolt",
  Streaming: "fa-tv",
  Educação: "fa-graduation-cap",
  Outros: "fa-receipt"
};

const rotulos = {
  paga: "Paga",
  pendente: "Pendente",
  atrasada: "Atrasada"
};

const contas = [
  {
    id: 1,
    nome: "Aluguel",
    categoria: "Moradia",
    valor: 1200,
    vencimento: 10,
    status: "pendente"
  },
  {
    id: 2,
    nome: "Internet",
    categoria: "Internet",
    valor: 120,
    vencimento: 10,
    status: "pendente"
  },
  {
    id: 3,
    nome: "Academia",
    categoria: "Saúde",
    valor: 89.9,
    vencimento: 5,
    status: "paga"
  },
  {
    id: 4,
    nome: "Conta de luz",
    categoria: "Energia",
    valor: 210,
    vencimento: 2,
    status: "atrasada"
  },
  {
    id: 5,
    nome: "Netflix",
    categoria: "Streaming",
    valor: 55.9,
    vencimento: 15,
    status: "paga"
  },
  {
    id: 6,
    nome: "Água",
    categoria: "Moradia",
    valor: 95,
    vencimento: 8,
    status: "pendente"
  },
  {
    id: 7,
    nome: "Curso de inglês",
    categoria: "Educação",
    valor: 240,
    vencimento: 20,
    status: "pendente"
  }
];

let filtroStatus = "todas";
let busca = "";

function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function filtrar() {
  const termo = busca.trim().toLowerCase();
  return contas.filter(conta => {
    const okStatus = filtroStatus === "todas" || conta.status === filtroStatus;
    const okBusca = conta.nome.toLowerCase().includes(termo);
    return okStatus && okBusca;
  });
}

function atualizarResumo() {
  const total = contas.reduce((soma, c) => soma + c.valor, 0);
  const pago = contas
    .filter(c => c.status === "paga")
    .reduce((soma, c) => soma + c.valor, 0);

  document.getElementById("mens-total").textContent = "R$ " + formatar(total);
  document.getElementById("mens-pago").textContent = "R$ " + formatar(pago);
  document.getElementById("mens-apagar").textContent = "R$ " + formatar(total - pago);
}

function venceTexto(conta) {
  if (conta.status === "atrasada") {
    return "Venceu dia " + conta.vencimento;
  }
  return "Vence dia " + conta.vencimento;
}

function card(conta) {
  const icone = icones[conta.categoria] || "fa-receipt";
  const paga = conta.status === "paga";
  const botao = paga
    ? `<button class="mens-btn done" type="button" disabled><i class="fa-solid fa-check"></i> Paga</button>`
    : `<button class="mens-btn" type="button" data-id="${conta.id}">Marcar paga</button>`;

  return `<div class="mens-card">
    <div class="mens-top">
      <span class="mens-icon"><i class="fa-solid ${icone}"></i></span>
      <div>
        <div class="mens-name">${conta.nome}</div>
        <div class="mens-cat">${conta.categoria}</div>
      </div>
    </div>
    <div class="mens-value">R$ ${formatar(conta.valor)}</div>
    <div class="mens-due"><i class="fa-regular fa-calendar"></i> ${venceTexto(conta)}</div>
    <div class="mens-foot">
      <span class="mens-badge ${conta.status}">${rotulos[conta.status]}</span>
      ${botao}
    </div>
  </div>`;
}

function render() {
  const lista = filtrar();
  const grid = document.getElementById("mens-grid");

  if (lista.length === 0) {
    grid.innerHTML = `<div class="mens-empty">Nenhuma mensalidade encontrada.</div>`;
  } else {
    grid.innerHTML = lista.map(card).join("");
  }

  atualizarResumo();
}

export function init() {
  document.getElementById("mens-tabs").addEventListener("click", e => {
    const botao = e.target.closest(".tx-tab");
    if (!botao) return;

    document.querySelectorAll("#mens-tabs .tx-tab").forEach(tab => {
      tab.classList.toggle("is-active", tab === botao);
    });

    filtroStatus = botao.dataset.filter;
    render();
  });

  document.getElementById("mens-search-input").addEventListener("input", e => {
    busca = e.target.value;
    render();
  });

  document.getElementById("mens-grid").addEventListener("click", e => {
    const botao = e.target.closest(".mens-btn[data-id]");
    if (!botao) return;

    const conta = contas.find(c => c.id === Number(botao.dataset.id));
    if (conta) {
      conta.status = "paga";
      render();
    }
  });

  render();
}
