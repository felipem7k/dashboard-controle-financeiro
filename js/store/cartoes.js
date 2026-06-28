import { load, save } from "./storage.js";
import { chavesBandeiras } from "./bandeiras.js";

const CHAVE = "financas:cartoes";

let lista = load(CHAVE, []);
const assinantes = new Set();

function persistir() {
  save(CHAVE, lista);
  assinantes.forEach(fn => fn());
}

function diaValido(valor) {
  return Number.isInteger(valor) && valor >= 1 && valor <= 31;
}

function validar(dados) {
  if (!dados.nome || !dados.nome.trim()) {
    throw new Error("Informe o nome do cartão.");
  }
  if (!dados.titular || !dados.titular.trim()) {
    throw new Error("Informe o titular.");
  }
  if (!chavesBandeiras().includes(dados.bandeira)) {
    throw new Error("Bandeira inválida.");
  }
  if (!/^\d{4}$/.test(dados.final)) {
    throw new Error("Informe os 4 últimos dígitos.");
  }
  if (typeof dados.limite !== "number" || isNaN(dados.limite) || dados.limite <= 0) {
    throw new Error("Informe um limite maior que zero.");
  }
  if (!diaValido(dados.diaVencimento)) {
    throw new Error("Dia de vencimento deve ser entre 1 e 31.");
  }
  if (!diaValido(dados.diaFechamento)) {
    throw new Error("Dia de fechamento deve ser entre 1 e 31.");
  }
}

export function getAll() {
  return [...lista];
}

export function add(dados) {
  const cartao = {
    id: "card_" + Date.now(),
    nome: dados.nome.trim(),
    bandeira: dados.bandeira,
    final: dados.final,
    titular: dados.titular.trim(),
    limite: dados.limite,
    diaVencimento: dados.diaVencimento,
    diaFechamento: dados.diaFechamento
  };
  validar(cartao);
  lista.push(cartao);
  persistir();
  return cartao;
}

export function remove(id) {
  lista = lista.filter(cartao => cartao.id !== id);
  persistir();
}

export function subscribe(fn) {
  assinantes.add(fn);
  return () => assinantes.delete(fn);
}
