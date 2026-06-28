import { getAll, add, remove, mensalEquivalente, subscribe } from "../store/assinaturas.js";
import { catAssinaturas, nomesCatAssinaturas } from "../store/catAssinaturas.js";
import { metodos } from "../store/metodos.js";
import { formatar, lerValor } from "../utils/moeda.js";
import { abrirModal } from "../ui/modal.js";
import { camposPagamentoHTML, ligarCamposPagamento, lerPagamento } from "../ui/camposPagamento.js";

let filtroCiclo = "todas";
let busca = "";

function estilo(assin) {
  return catAssinaturas[assin.categoria] || catAssinaturas.Outros;
}

function filtrar() {
  const termo = busca.trim().toLowerCase();
  return getAll().filter(assin => {
    const okCiclo = filtroCiclo === "todas" || assin.ciclo === filtroCiclo;
    const okBusca = assin.nome.toLowerCase().includes(termo);
    return okCiclo && okBusca;
  });
}

function proximaRenovacao(lista) {
  const diaHoje = new Date().getDate();
  const futuras = lista.filter(a => a.diaRenovacao >= diaHoje);
  const base = futuras.length ? futuras : lista;
  return [...base].sort((a, b) => a.diaRenovacao - b.diaRenovacao)[0];
}

function atualizarResumo() {
  const todas = getAll();

  if (todas.length === 0) {
    document.getElementById("assin-total").textContent = "R$ 0,00";
    document.getElementById("assin-anual").textContent = "R$ 0,00 por ano";
    document.getElementById("assin-proxima").textContent = "--";
    document.getElementById("assin-proxima-data").textContent = "--";
    document.getElementById("assin-cara").textContent = "--";
    document.getElementById("assin-cara-valor").textContent = "--";
    return;
  }

  const totalMes = todas.reduce((soma, a) => soma + mensalEquivalente(a), 0);
  document.getElementById("assin-total").textContent = "R$ " + formatar(totalMes);
  document.getElementById("assin-anual").textContent = "R$ " + formatar(totalMes * 12) + " por ano";

  const proxima = proximaRenovacao(todas);
  document.getElementById("assin-proxima").textContent = proxima.nome;
  document.getElementById("assin-proxima-data").textContent = "Renova dia " + proxima.diaRenovacao;

  const cara = [...todas].sort((a, b) => mensalEquivalente(b) - mensalEquivalente(a))[0];
  document.getElementById("assin-cara").textContent = cara.nome;
  document.getElementById("assin-cara-valor").textContent = "R$ " + formatar(mensalEquivalente(cara)) + "/mês";
}

function card(assin) {
  const { icon, cor } = estilo(assin);
  const ciclo = assin.ciclo === "anual" ? "Anual" : "Mensal";
  const unidade = assin.ciclo === "anual" ? "/ano" : "/mês";
  const classeBadge = assin.ciclo === "anual" ? "assin-badge anual" : "assin-badge";
  const metodo = metodos[assin.metodo];

  return `<div class="assin-card">
    <button class="assin-del" type="button" data-remove="${assin.id}" aria-label="Remover">
      <i class="fa-solid fa-trash"></i>
    </button>
    <div class="assin-top">
      <span class="assin-icon" style="background: ${cor}"><i class="fa-solid ${icon}"></i></span>
      <div>
        <div class="assin-name">${assin.nome}</div>
        <div class="assin-cat">${assin.categoria}</div>
      </div>
    </div>
    <div class="assin-price">R$ ${formatar(assin.valor)} <span>${unidade}</span></div>
    <div class="assin-foot">
      <span class="assin-renew"><i class="fa-regular fa-calendar"></i> Renova dia ${assin.diaRenovacao}</span>
      <span class="${classeBadge}">${ciclo}</span>
    </div>
    <div class="assin-pay">
      <i class="fa-solid ${metodo ? metodo.icon : "fa-money-bill"}"></i>
      ${metodo ? metodo.nome : ""}
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

function montarForm() {
  const opcoes = nomesCatAssinaturas()
    .map(nome => `<option value="${nome}">${nome}</option>`)
    .join("");

  const form = document.createElement("form");
  form.className = "tx-form";
  form.innerHTML = `
    <label class="tx-field">
      <span>Nome</span>
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
    <div class="tx-field">
      <span>Ciclo</span>
      <div class="tx-radios">
        <label><input name="ciclo" type="radio" value="mensal" checked> Mensal</label>
        <label><input name="ciclo" type="radio" value="anual"> Anual</label>
      </div>
    </div>
    <label class="tx-field">
      <span>Dia de renovação (1-31)</span>
      <input name="diaRenovacao" type="number" min="1" max="31">
    </label>
    ${camposPagamentoHTML()}`;
  return form;
}

function abrirNova() {
  const form = montarForm();
  ligarCamposPagamento(form);

  abrirModal({
    titulo: "Nova assinatura",
    conteudo: form,
    onConfirmar: () => {
      const pagto = lerPagamento(form);
      add({
        nome: form.nome.value,
        categoria: form.categoria.value,
        valor: lerValor(form.valor.value),
        ciclo: form.ciclo.value,
        diaRenovacao: parseInt(form.diaRenovacao.value, 10),
        metodo: pagto.metodo,
        cartaoId: pagto.cartaoId,
        parcelas: pagto.parcelas
      });
    }
  });
}

export function init() {
  document.getElementById("assin-add-btn").addEventListener("click", abrirNova);

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

  document.getElementById("assin-grid").addEventListener("click", e => {
    const botao = e.target.closest(".assin-del");
    if (!botao) return;
    if (confirm("Remover esta assinatura?")) {
      remove(botao.dataset.remove);
    }
  });

  subscribe(render);

  render();
}
