export const categorias = {
  Salário: "fa-sack-dollar",
  Alimentação: "fa-cart-shopping",
  Moradia: "fa-house",
  Transporte: "fa-car",
  Lazer: "fa-film",
  Outros: "fa-receipt"
};

export function nomesCategorias() {
  return Object.keys(categorias);
}
