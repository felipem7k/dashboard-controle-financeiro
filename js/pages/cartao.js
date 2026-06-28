import { getAll, add, remove, subscribe } from "../store/cartoes.js";
import { bandeiras, chavesBandeiras } from "../store/bandeiras.js";
import { formatar, lerValor } from "../utils/moeda.js";
import { abrirModal } from "../ui/modal.js";

const iconesCategoria = {
  Alimentação: "fa-cart-shopping",
  Transporte: "fa-car",
  Lazer: "fa-film",
  Compras: "fa-bag-shopping",
  Streaming: "fa-tv",
  Outros: "fa-receipt"
};

let ativo = null;

function iconeBandeira(chave) {
  return bandeiras[chave] ? bandeiras[chave].icon : "fa-credit-card";
}

function totalFatura(cartao) {
  return cartao.compras.reduce((soma, c) => soma + c.valor, 0);
}

function cartaoAtivo() {
  const lista = getAll();
  if (lista.length === 0) return null;
  const achado = lista.find(c => c.id === ativo);
  return achado || lista[0];
}

function botaoNovo() {
  return `<button class="card-chip card-chip-add" type="button" id="card-add-btn">
    <i class="fa-solid fa-plus"></i>
    <span class="card-chip-name">Novo cartão</span>
  </button>`;
}

function renderSeletor() {
  const alvo = document.getElementById("card-selector");
  const lista = getAll();
  const chips = lista
    .map(cartao => {
      const classe = cartao.id === ativo ? "card-chip is-active" : "card-chip";
      return `<button class="${classe}" type="button" data-id="${cartao.id}">
        <i class="card-chip-icon fa-brands ${iconeBandeira(cartao.bandeira)}"></i>
        <span>
          <span class="card-chip-name">${cartao.nome}</span>
          <span class="card-chip-last"> •••• ${cartao.final}</span>
        </span>
      </button>`;
    })
    .join("");
  alvo.innerHTML = chips + botaoNovo();
}

function renderCartao(cartao) {
  document.getElementById("credit-card").innerHTML = `
    <button class="cc-del" type="button" data-remove="${cartao.id}" aria-label="Remover cartão">
      <i class="fa-solid fa-trash"></i>
    </button>
    <div class="cc-top">
      <span class="cc-brand">${cartao.nome}</span>
      <span class="cc-chip"></span>
    </div>
    <div class="cc-number">•••• •••• •••• ${cartao.final}</div>
    <div class="cc-bottom">
      <div>
        <div class="cc-label">Titular</div>
        <div class="cc-name">${cartao.titular}</div>
      </div>
      <span class="cc-flag"><i class="fa-brands ${iconeBandeira(cartao.bandeira)}"></i></span>
    </div>`;
}

function renderLimite(cartao) {
  const usado = totalFatura(cartao);
  const pct = Math.round((usado / cartao.limite) * 100);

  document.getElementById("card-limit").innerHTML = `
    <div class="limit-head">
      <span>Limite usado</span>
      <span>${pct}%</span>
    </div>
    <div class="limit-bar">
      <div class="limit-fill" style="width: ${pct}%"></div>
    </div>
    <div class="limit-foot">
      R$ ${formatar(usado)} <span class="muted">de R$ ${formatar(cartao.limite)}</span>
    </div>`;
}

function renderFatura(cartao) {
  document.getElementById("card-invoice-total").textContent = "R$ " + formatar(totalFatura(cartao));
  document.getElementById("card-due").textContent = "dia " + cartao.diaVencimento;
  document.getElementById("card-close").textContent = "dia " + cartao.diaFechamento;
}

function renderCompras(cartao) {
  const alvo = document.getElementById("card-purchases-list");

  if (cartao.compras.length === 0) {
    alvo.innerHTML = `<li class="card-empty">Nenhuma compra nesta fatura.</li>`;
    return;
  }

  alvo.innerHTML = cartao.compras
    .map(compra => {
      const icone = iconesCategoria[compra.categoria] || "fa-receipt";
      return `<li class="recent-item">
        <span class="recent-icon down"><i class="fa-solid ${icone}"></i></span>
        <div class="recent-info">
          <span class="recent-desc">${compra.desc}</span>
          <span class="recent-date">${compra.categoria} · ${compra.data}</span>
        </div>
        <span class="recent-value down">- R$ ${formatar(compra.valor)}</span>
      </li>`;
    })
    .join("");
}

function renderVazio() {
  document.getElementById("card-selector").innerHTML = botaoNovo();
  document.getElementById("credit-card").innerHTML = `
    <div class="cc-vazio">Nenhum cartão cadastrado.</div>`;
  document.getElementById("card-limit").innerHTML = "";
  document.getElementById("card-invoice-total").textContent = "R$ 0,00";
  document.getElementById("card-due").textContent = "--";
  document.getElementById("card-close").textContent = "--";
  document.getElementById("card-purchases-list").innerHTML =
    `<li class="card-empty">Adicione um cartão para começar.</li>`;
}

function render() {
  const cartao = cartaoAtivo();

  if (!cartao) {
    renderVazio();
    return;
  }

  ativo = cartao.id;
  renderSeletor();
  renderCartao(cartao);
  renderLimite(cartao);
  renderFatura(cartao);
  renderCompras(cartao);
}

function montarForm() {
  const opcoes = chavesBandeiras()
    .map(chave => `<option value="${chave}">${bandeiras[chave].nome}</option>`)
    .join("");

  const form = document.createElement("form");
  form.className = "tx-form";
  form.innerHTML = `
    <label class="tx-field">
      <span>Nome do cartão</span>
      <input name="nome" type="text" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Titular</span>
      <input name="titular" type="text" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Bandeira</span>
      <select name="bandeira">${opcoes}</select>
    </label>
    <label class="tx-field">
      <span>Final (4 dígitos)</span>
      <input name="final" type="text" inputmode="numeric" maxlength="4" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Limite (R$)</span>
      <input name="limite" type="text" inputmode="decimal" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Dia de vencimento (1-31)</span>
      <input name="diaVencimento" type="number" min="1" max="31">
    </label>
    <label class="tx-field">
      <span>Dia de fechamento (1-31)</span>
      <input name="diaFechamento" type="number" min="1" max="31">
    </label>`;
  return form;
}

function abrirNovo() {
  const form = montarForm();
  abrirModal({
    titulo: "Novo cartão",
    conteudo: form,
    onConfirmar: () => {
      const criado = add({
        nome: form.nome.value,
        titular: form.titular.value,
        bandeira: form.bandeira.value,
        final: form.final.value,
        limite: lerValor(form.limite.value),
        diaVencimento: parseInt(form.diaVencimento.value, 10),
        diaFechamento: parseInt(form.diaFechamento.value, 10)
      });
      ativo = criado.id;
    }
  });
}

export function init() {
  document.getElementById("card-selector").addEventListener("click", e => {
    if (e.target.closest("#card-add-btn")) {
      abrirNovo();
      return;
    }

    const chip = e.target.closest(".card-chip");
    if (!chip) return;

    ativo = chip.dataset.id;
    render();
  });

  document.getElementById("credit-card").addEventListener("click", e => {
    const botao = e.target.closest(".cc-del");
    if (!botao) return;
    if (confirm("Remover este cartão?")) {
      remove(botao.dataset.remove);
    }
  });

  subscribe(render);

  render();
}
