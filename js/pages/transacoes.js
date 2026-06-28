import { getAll, add, remove, subscribe } from "../store/transacoes.js";
import { categorias, nomesCategorias } from "../store/categorias.js";
import { metodos, chavesMetodos } from "../store/metodos.js";
import { getAll as getCartoes } from "../store/cartoes.js";
import { formatarData, hoje } from "../utils/datas.js";
import { formatar, lerValor } from "../utils/moeda.js";
import { abrirModal } from "../ui/modal.js";

let filtroTipo = "todas";
let busca = "";

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

function metodoLabel(tx) {
  const meta = metodos[tx.metodo];
  if (!meta) return "";
  if (tx.metodo === "credito") {
    const cartao = getCartoes().find(c => c.id === tx.cartaoId);
    const sufixo = cartao ? " •••• " + cartao.final : "";
    const parcelas = tx.parcelas > 1 ? " " + tx.parcelas + "x" : "";
    return meta.nome + sufixo + parcelas;
  }
  return meta.nome;
}

function linha(tx) {
  const icone = categorias[tx.categoria] || "fa-receipt";
  const sinal = tx.tipo === "entrada" ? "+" : "-";
  const dir = tx.tipo === "entrada" ? "up" : "down";
  const badge = tx.tipo === "entrada" ? "Entrada" : "Saída";
  const metodo = metodos[tx.metodo];

  return `<tr>
    <td><span class="tx-cat-icon"><i class="fa-solid ${icone}"></i></span></td>
    <td>${tx.desc}</td>
    <td class="tx-cat">${tx.categoria}</td>
    <td class="tx-date">${formatarData(tx.data)}</td>
    <td><span class="tx-badge ${dir}">${badge}</span></td>
    <td class="tx-metodo">
      <i class="fa-solid ${metodo ? metodo.icon : "fa-money-bill"}"></i>
      ${metodoLabel(tx)}
    </td>
    <td class="tx-value ${dir}">${sinal} R$ ${formatar(tx.valor)}</td>
    <td class="tx-actions">
      <button class="tx-del" type="button" data-remove="${tx.id}" aria-label="Remover">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  </tr>`;
}

function render() {
  const lista = filtrar();
  const body = document.getElementById("tx-body");

  if (lista.length === 0) {
    body.innerHTML = `<tr><td class="tx-empty" colspan="8">Nenhuma transação encontrada.</td></tr>`;
  } else {
    body.innerHTML = lista.map(linha).join("");
  }

  atualizarResumo(lista);
}

function montarForm() {
  const opcoesCat = nomesCategorias()
    .map(nome => `<option value="${nome}">${nome}</option>`)
    .join("");

  const opcoesMetodo = chavesMetodos()
    .map(chave => `<option value="${chave}">${metodos[chave].nome}</option>`)
    .join("");

  const cartoes = getCartoes();
  const opcoesCartao = cartoes.length
    ? cartoes.map(c => `<option value="${c.id}">${c.nome} •••• ${c.final}</option>`).join("")
    : `<option value="">Nenhum cartão — cadastre na aba Cartão</option>`;

  const form = document.createElement("form");
  form.className = "tx-form";
  form.innerHTML = `
    <label class="tx-field">
      <span>Descrição</span>
      <input name="desc" type="text" autocomplete="off">
    </label>
    <label class="tx-field">
      <span>Valor (R$)</span>
      <input name="valor" type="text" inputmode="decimal" autocomplete="off">
    </label>
    <div class="tx-field">
      <span>Tipo</span>
      <div class="tx-radios">
        <label><input name="tipo" type="radio" value="entrada" checked> Entrada</label>
        <label><input name="tipo" type="radio" value="saida"> Saída</label>
      </div>
    </div>
    <label class="tx-field">
      <span>Categoria</span>
      <select name="categoria">${opcoesCat}</select>
    </label>
    <label class="tx-field">
      <span>Método</span>
      <select name="metodo">${opcoesMetodo}</select>
    </label>
    <div class="tx-credito" data-credito hidden>
      <label class="tx-field">
        <span>Cartão</span>
        <select name="cartaoId">${opcoesCartao}</select>
      </label>
      <label class="tx-field">
        <span>Parcelas (1-24)</span>
        <input name="parcelas" type="number" min="1" max="24" value="1">
      </label>
    </div>
    <label class="tx-field">
      <span>Data</span>
      <input name="data" type="date" value="${hoje()}">
    </label>`;
  return form;
}

function abrirNova() {
  const form = montarForm();
  const blocoCredito = form.querySelector("[data-credito]");

  form.metodo.addEventListener("change", () => {
    blocoCredito.hidden = form.metodo.value !== "credito";
  });

  abrirModal({
    titulo: "Nova transação",
    conteudo: form,
    onConfirmar: () => {
      const credito = form.metodo.value === "credito";
      add({
        desc: form.desc.value,
        valor: lerValor(form.valor.value),
        tipo: form.tipo.value,
        categoria: form.categoria.value,
        data: form.data.value,
        metodo: form.metodo.value,
        cartaoId: credito ? form.cartaoId.value : null,
        parcelas: credito ? parseInt(form.parcelas.value, 10) : 1
      });
    }
  });
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

  document.getElementById("tx-add-btn").addEventListener("click", abrirNova);

  document.getElementById("tx-body").addEventListener("click", e => {
    const botao = e.target.closest(".tx-del");
    if (!botao) return;
    if (confirm("Remover esta transação?")) {
      remove(botao.dataset.remove);
    }
  });

  subscribe(render);

  render();
}
