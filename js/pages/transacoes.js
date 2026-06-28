import { getAll, subscribe } from "../store/transacoes.js";
import { categorias } from "../store/categorias.js";
import { formatarData } from "../utils/datas.js";

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
  return getAll().filter(tx => {
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
    <td class="tx-date">${formatarData(tx.data)}</td>
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

  subscribe(render);

  render();
}
