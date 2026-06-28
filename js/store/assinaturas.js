import { load, save } from "./storage.js";
import { nomesCatAssinaturas } from "./catAssinaturas.js";
import { chavesMetodos } from "./metodos.js";
import { getAll as getCartoes } from "./cartoes.js";

const CHAVE = "financas:assinaturas";

let lista = load(CHAVE, []);
const assinantes = new Set();

function persistir() {
  save(CHAVE, lista);
  assinantes.forEach(fn => fn());
}

function validar(dados) {
  if (!dados.nome || !dados.nome.trim()) {
    throw new Error("Informe o nome da assinatura.");
  }
  if (!nomesCatAssinaturas().includes(dados.categoria)) {
    throw new Error("Categoria inválida.");
  }
  if (typeof dados.valor !== "number" || isNaN(dados.valor) || dados.valor <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }
  if (dados.ciclo !== "mensal" && dados.ciclo !== "anual") {
    throw new Error("Ciclo inválido.");
  }
  if (!Number.isInteger(dados.diaRenovacao) || dados.diaRenovacao < 1 || dados.diaRenovacao > 31) {
    throw new Error("Dia de renovação deve ser entre 1 e 31.");
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
  }
}

export function mensalEquivalente(assinatura) {
  return assinatura.ciclo === "anual" ? assinatura.valor / 12 : assinatura.valor;
}

export function getAll() {
  return [...lista];
}

export function add(dados) {
  const credito = dados.metodo === "credito";
  const assinatura = {
    id: "assin_" + Date.now(),
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    valor: dados.valor,
    ciclo: dados.ciclo,
    diaRenovacao: dados.diaRenovacao,
    metodo: dados.metodo,
    cartaoId: credito ? dados.cartaoId : null,
    parcelas: 1
  };
  validar(assinatura);
  lista.push(assinatura);
  persistir();
  return assinatura;
}

export function remove(id) {
  lista = lista.filter(a => a.id !== id);
  persistir();
}

export function subscribe(fn) {
  assinantes.add(fn);
  return () => assinantes.delete(fn);
}
