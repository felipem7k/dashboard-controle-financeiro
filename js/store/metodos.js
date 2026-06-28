export const metodos = {
  pix: {
    nome: "Pix",
    icon: "fa-bolt"
  },
  debito: {
    nome: "Débito",
    icon: "fa-money-check"
  },
  credito: {
    nome: "Crédito",
    icon: "fa-credit-card"
  },
  boleto: {
    nome: "Boleto",
    icon: "fa-barcode"
  },
  dinheiro: {
    nome: "Dinheiro",
    icon: "fa-money-bill"
  }
};

export function chavesMetodos() {
  return Object.keys(metodos);
}
