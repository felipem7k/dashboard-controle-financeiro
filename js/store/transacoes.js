import { load, save } from "./storage.js";
import { nomesCategorias } from "./categorias.js";
import { chavesMetodos } from "./metodos.js";
import { getAll as getCartoes } from "./cartoes.js";

const CHAVE = "financas:transacoes";

let lista = load(CHAVE, []);
const assinantes = new Set();

function persistir() {
  save(CHAVE, lista);
  assinantes.forEach(fn => fn());
}

function ordenar(arr) {
  return [...arr].sort((a, b) => (a.data < b.data ? 1 : -1));
}

function validar(dados) {
  if (!dados.desc || !dados.desc.trim()) {
    throw new Error("Informe uma descrição.");
  }
  if (typeof dados.valor !== "number" || isNaN(dados.valor) || dados.valor <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }
  if (dados.tipo !== "entrada" && dados.tipo !== "saida") {
    throw new Error("Tipo inválido.");
  }
  if (!nomesCategorias().includes(dados.categoria)) {
    throw new Error("Categoria inválida.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) {
    throw new Error("Data inválida.");
  }
  if (!chavesMetodos().includes(dados.metodo)) {
    throw new Error("Método de pagamento inválido.");
  }
  if (dados.metodo === "credito") {
    if (!dados.cartaoId) {
      throw new Error("Selecione um cartão.");
    }
    if (!getCartoes().some(c => c.id === dados.cartaoId)) {
      throw new Error("Cartão inválido.");
    }
    if (!Number.isInteger(dados.parcelas) || dados.parcelas < 1 || dados.parcelas > 24) {
      throw new Error("Parcelas deve ser entre 1 e 24.");
    }
  }
}

function normalizar(tx) {
  return {
    metodo: "dinheiro",
    cartaoId: null,
    parcelas: 1,
    ...tx
  };
}

export function getAll() {
  return ordenar(lista).map(normalizar);
}

export function add(dados) {
  const credito = dados.metodo === "credito";
  const tx = {
    id: "tx_" + Date.now(),
    desc: dados.desc.trim(),
    categoria: dados.categoria,
    data: dados.data,
    tipo: dados.tipo,
    valor: dados.valor,
    metodo: dados.metodo,
    cartaoId: credito ? dados.cartaoId : null,
    parcelas: credito ? dados.parcelas : 1
  };
  validar(tx);
  lista.push(tx);
  persistir();
  return tx;
}

export function remove(id) {
  lista = lista.filter(tx => tx.id !== id);
  persistir();
}

export function subscribe(fn) {
  assinantes.add(fn);
  return () => assinantes.delete(fn);
}
