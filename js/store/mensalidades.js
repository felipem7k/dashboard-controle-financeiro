import { load, save } from "./storage.js";
import { nomesCatMensalidades } from "./catMensalidades.js";
import { add as addTransacao, remove as removeTransacao } from "./transacoes.js";

const CHAVE = "financas:mensalidades";

let lista = load(CHAVE, []);
const assinantes = new Set();

function persistir() {
  save(CHAVE, lista);
  assinantes.forEach(fn => fn());
}

function validar(dados) {
  if (!dados.nome || !dados.nome.trim()) {
    throw new Error("Informe o nome da conta.");
  }
  if (!nomesCatMensalidades().includes(dados.categoria)) {
    throw new Error("Categoria inválida.");
  }
  if (typeof dados.valor !== "number" || isNaN(dados.valor) || dados.valor <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }
  if (!Number.isInteger(dados.diaVencimento) || dados.diaVencimento < 1 || dados.diaVencimento > 31) {
    throw new Error("Dia de vencimento deve ser entre 1 e 31.");
  }
}

export function statusDe(mensalidade) {
  if (mensalidade.pago) return "paga";
  const diaHoje = new Date().getDate();
  if (mensalidade.diaVencimento < diaHoje) return "atrasada";
  return "pendente";
}

export function getAll() {
  return [...lista];
}

export function add(dados) {
  const mensalidade = {
    id: "mens_" + Date.now(),
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    valor: dados.valor,
    diaVencimento: dados.diaVencimento,
    pago: false,
    transacaoId: null
  };
  validar(mensalidade);
  lista.push(mensalidade);
  persistir();
  return mensalidade;
}

export function remove(id) {
  const mensalidade = lista.find(m => m.id === id);
  if (mensalidade && mensalidade.transacaoId) {
    removeTransacao(mensalidade.transacaoId);
  }
  lista = lista.filter(m => m.id !== id);
  persistir();
}

export function marcarPaga(id, dadosPagto) {
  const mensalidade = lista.find(m => m.id === id);
  if (!mensalidade || mensalidade.pago) return;

  const tx = addTransacao({
    desc: mensalidade.nome,
    categoria: "Outros",
    data: dadosPagto.data,
    tipo: "saida",
    valor: mensalidade.valor,
    metodo: dadosPagto.metodo,
    cartaoId: dadosPagto.cartaoId,
    parcelas: dadosPagto.parcelas
  });

  mensalidade.pago = true;
  mensalidade.transacaoId = tx.id;
  persistir();
}

export function desmarcar(id) {
  const mensalidade = lista.find(m => m.id === id);
  if (!mensalidade || !mensalidade.pago) return;

  if (mensalidade.transacaoId) {
    removeTransacao(mensalidade.transacaoId);
  }
  mensalidade.pago = false;
  mensalidade.transacaoId = null;
  persistir();
}

export function subscribe(fn) {
  assinantes.add(fn);
  return () => assinantes.delete(fn);
}
