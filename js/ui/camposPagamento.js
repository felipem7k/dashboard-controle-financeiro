import { metodos, chavesMetodos } from "../store/metodos.js";
import { getAll as getCartoes } from "../store/cartoes.js";

export function camposPagamentoHTML() {
  const opcoesMetodo = chavesMetodos()
    .map(chave => `<option value="${chave}">${metodos[chave].nome}</option>`)
    .join("");

  const cartoes = getCartoes();
  const opcoesCartao = cartoes.length
    ? cartoes.map(c => `<option value="${c.id}">${c.nome} •••• ${c.final}</option>`).join("")
    : `<option value="">Nenhum cartão — cadastre na aba Cartão</option>`;

  return `
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
    </div>`;
}

export function ligarCamposPagamento(form) {
  const bloco = form.querySelector("[data-credito]");
  form.metodo.addEventListener("change", () => {
    bloco.hidden = form.metodo.value !== "credito";
  });
}

export function lerPagamento(form) {
  const credito = form.metodo.value === "credito";
  return {
    metodo: form.metodo.value,
    cartaoId: credito ? form.cartaoId.value : null,
    parcelas: credito ? parseInt(form.parcelas.value, 10) : 1
  };
}
