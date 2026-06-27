const categorias = {
  Salário: "fa-sack-dollar",
  Alimentação: "fa-cart-shopping",
  Moradia: "fa-house",
  Transporte: "fa-car",
  Lazer: "fa-film",
  Outros: "fa-receipt"
};

const transacoes = [
  {
    desc: "Salário",
    categoria: "Salário",
    data: "25 jun",
    tipo: "entrada",
    valor: 6000
  },
  {
    desc: "Mercado",
    categoria: "Alimentação",
    data: "24 jun",
    tipo: "saida",
    valor: 320
  },
  {
    desc: "Aluguel",
    categoria: "Moradia",
    data: "22 jun",
    tipo: "saida",
    valor: 1200
  },
  {
    desc: "Freelance",
    categoria: "Salário",
    data: "20 jun",
    tipo: "entrada",
    valor: 850
  },
  {
    desc: "Uber",
    categoria: "Transporte",
    data: "19 jun",
    tipo: "saida",
    valor: 45
  },
  {
    desc: "Cinema",
    categoria: "Lazer",
    data: "18 jun",
    tipo: "saida",
    valor: 60
  },
  {
    desc: "Restaurante",
    categoria: "Alimentação",
    data: "16 jun",
    tipo: "saida",
    valor: 130
  },
  {
    desc: "Venda usados",
    categoria: "Outros",
    data: "14 jun",
    tipo: "entrada",
    valor: 400
  },
  {
    desc: "Conta de luz",
    categoria: "Moradia",
    data: "12 jun",
    tipo: "saida",
    valor: 180
  },
  {
    desc: "Gasolina",
    categoria: "Transporte",
    data: "10 jun",
    tipo: "saida",
    valor: 240
  }
];

let filtroTipo = "todas";
let busca = "";

function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function filtrar() {
  const termo = busca.trim().toLowerCase();
  return transacoes.filter(tx => {
    const okTipo = filtroTipo === "todas" || tx.tipo === filtroTipo;
    const okBusca = tx.desc.toLowerCase().includes(termo);
    return okTipo && okBusca;
  });
}

function atualizarResumo(lista) {
  const entradas = lista
    .filter(tx => tx.tipo === "entrada")
    .reduce((soma, tx) => soma + tx.valor, 0);
  const saidas = lista
    .filter(tx => tx.tipo === "saida")
    .reduce((soma, tx) => soma + tx.valor, 0);

  document.getElementById("tx-total-in").textContent = "R$ " + formatar(entradas);
  document.getElementById("tx-total-out").textContent = "R$ " + formatar(saidas);
  document.getElementById("tx-balance").textContent = "R$ " + formatar(entradas - saidas);
}

function linha(tx) {
  const icone = categorias[tx.categoria] || "fa-receipt";
  const sinal = tx.tipo === "entrada" ? "+" : "-";
  const dir = tx.tipo === "entrada" ? "up" : "down";
  const badge = tx.tipo === "entrada" ? "Entrada" : "Saída";

  return `<tr>
    <td><span class="tx-cat-icon"><i class="fa-solid ${icone}"></i></span></td>
    <td>${tx.desc}</td>
    <td class="tx-cat">${tx.categoria}</td>
    <td class="tx-date">${tx.data}</td>
    <td><span class="tx-badge ${dir}">${badge}</span></td>
    <td class="tx-value ${dir}">${sinal} R$ ${formatar(tx.valor)}</td>
  </tr>`;
}

function render() {
  const lista = filtrar();
  const body = document.getElementById("tx-body");

  if (lista.length === 0) {
    body.innerHTML = `<tr><td class="tx-empty" colspan="6">Nenhuma transação encontrada.</td></tr>`;
  } else {
    body.innerHTML = lista.map(linha).join("");
  }

  atualizarResumo(lista);
}

export function init() {
  document.getElementById("tx-tabs").addEventListener("click", e => {
    const botao = e.target.closest(".tx-tab");
    if (!botao) return;

    document.querySelectorAll(".tx-tab").forEach(tab => {
      tab.classList.toggle("is-active", tab === botao);
    });

    filtroTipo = botao.dataset.filter;
    render();
  });

  document.getElementById("tx-search-input").addEventListener("input", e => {
    busca = e.target.value;
    render();
  });

  render();
}
