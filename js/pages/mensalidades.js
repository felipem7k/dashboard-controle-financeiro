import { getAll, add, remove, marcarPaga, desmarcar, statusDe, subscribe } from "../store/mensalidades.js";
import { catMensalidades, nomesCatMensalidades } from "../store/catMensalidades.js";
import { formatar, lerValor } from "../utils/moeda.js";
import { hoje } from "../utils/datas.js";
import { abrirModal } from "../ui/modal.js";
import { camposPagamentoHTML, ligarCamposPagamento, lerPagamento } from "../ui/camposPagamento.js";

const rotulos = {
  paga: "Paga",
  pendente: "Pendente",
  atrasada: "Atrasada"
};

let filtroStatus = "todas";
let busca = "";

function filtrar() {
  const termo = busca.trim().toLowerCase();
  return getAll().filter(conta => {
    const status = statusDe(conta);
    const okStatus = filtroStatus === "todas" || status === filtroStatus;
    const okBusca = conta.nome.toLowerCase().includes(termo);
    return okStatus && okBusca;
  });
}

function atualizarResumo() {
  const todas = getAll();
  const total = todas.reduce((soma, c) => soma + c.valor, 0);
  const pago = todas
    .filter(c => c.pago)
    .reduce((soma, c) => soma + c.valor, 0);

  document.getElementById("mens-total").textContent = "R$ " + formatar(total);
  document.getElementById("mens-pago").textContent = "R$ " + formatar(pago);
  document.getElementById("mens-apagar").textContent = "R$ " + formatar(total - pago);
}

function venceTexto(conta, status) {
  if (status === "atrasada") {
    return "Venceu dia " + conta.diaVencimento;
  }
  return "Vence dia " + conta.diaVencimento;
}

function card(conta) {
  const status = statusDe(conta);
  const icone = catMensalidades[conta.categoria] || "fa-receipt";
  const acao = conta.pago
    ? `<button class="mens-btn done" type="button" data-desmarcar="${conta.id}"><i class="fa-solid fa-check"></i> Paga</button>`
    : `<button class="mens-btn" type="button" data-pagar="${conta.id}">Marcar paga</button>`;

  return `<div class="mens-card">
    <button class="mens-del" type="button" data-remove="${conta.id}" aria-label="Remover">
      <i class="fa-solid fa-trash"></i>
    </button>
    <div class="mens-top">
      <span class="mens-icon"><i class="fa-solid ${icone}"></i></span>
      <div>
        <div class="mens-name">${conta.nome}</div>
        <div class="mens-cat">${conta.categoria}</div>
      </div>
    </div>
    <div class="mens-value">R$ ${formatar(conta.valor)}</div>
    <div class="mens-due"><i class="fa-regular fa-calendar"></i> ${venceTexto(conta, status)}</div>
    <div class="mens-foot">
      <span class="mens-badge ${status}">${rotulos[status]}</span>
      ${acao}
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

function montarForm() {
  const opcoes = nomesCatMensalidades()
    .map(nome => `<option value="${nome}">${nome}</option>`)
    .join("");

  const form = document.createElement("form");
  form.className = "tx-form";
  form.innerHTML = `
    <label class="tx-field">
      <span>Nome da conta</span>
      <input name="nome" type="text" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Categoria</span>
      <select name="categoria">${opcoes}</select>
    </label>
    <label class="tx-field">
      <span>Valor (R$)</span>
      <input name="valor" type="text" inputmode="decimal" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Dia de vencimento (1-31)</span>
      <input name="diaVencimento" type="number" min="1" max="31">
    </label>`;
  return form;
}

function abrirNova() {
  const form = montarForm();
  abrirModal({
    titulo: "Nova mensalidade",
    conteudo: form,
    onConfirmar: () => {
      add({
        nome: form.nome.value,
        categoria: form.categoria.value,
        valor: lerValor(form.valor.value),
        diaVencimento: parseInt(form.diaVencimento.value, 10)
      });
    }
  });
}

function abrirPagamento(id) {
  const conta = getAll().find(c => c.id === id);
  if (!conta) return;

  const form = document.createElement("form");
  form.className = "tx-form";
  form.innerHTML = `
    <div class="tx-field">
      <span>Valor</span>
      <div class="mens-pay-valor">R$ ${formatar(conta.valor)}</div>
    </div>
    ${camposPagamentoHTML()}
    <label class="tx-field">
      <span>Data</span>
      <input name="data" type="date" value="${hoje()}">
    </label>`;

  ligarCamposPagamento(form);

  abrirModal({
    titulo: `Pagar "${conta.nome}"`,
    conteudo: form,
    onConfirmar: () => {
      const pagto = lerPagamento(form);
      marcarPaga(id, {
        data: form.data.value,
        metodo: pagto.metodo,
        cartaoId: pagto.cartaoId,
        parcelas: pagto.parcelas
      });
    }
  });
}

export function init() {
  document.getElementById("mens-add-btn").addEventListener("click", abrirNova);

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
    const pagar = e.target.closest("[data-pagar]");
    if (pagar) {
      abrirPagamento(pagar.dataset.pagar);
      return;
    }

    const desmarcarBtn = e.target.closest("[data-desmarcar]");
    if (desmarcarBtn) {
      if (confirm("Desmarcar pagamento? A transação gerada será removida.")) {
        desmarcar(desmarcarBtn.dataset.desmarcar);
      }
      return;
    }

    const remover = e.target.closest("[data-remove]");
    if (remover) {
      if (confirm("Remover esta mensalidade?")) {
        remove(remover.dataset.remove);
      }
    }
  });

  subscribe(render);

  render();
}
