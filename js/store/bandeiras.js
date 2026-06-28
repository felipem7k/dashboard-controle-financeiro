export const bandeiras = {
  mastercard: {
    nome: "Mastercard",
    icon: "fa-cc-mastercard"
  },
  visa: {
    nome: "Visa",
    icon: "fa-cc-visa"
  },
  elo: {
    nome: "Elo",
    icon: "fa-cc-diners-club"
  },
  amex: {
    nome: "Amex",
    icon: "fa-cc-amex"
  },
  hipercard: {
    nome: "Hipercard",
    icon: "fa-cc-jcb"
  }
};

export function chavesBandeiras() {
  return Object.keys(bandeiras);
}
