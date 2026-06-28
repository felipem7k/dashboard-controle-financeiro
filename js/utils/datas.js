const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return Number(dia) + " " + MESES[Number(mes) - 1];
}
