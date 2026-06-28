export function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function lerValor(texto) {
  const limpo = texto.replace(/\./g, "").replace(",", ".");
  return parseFloat(limpo);
}
