const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return Number(dia) + " " + MESES[Number(mes) - 1];
}

export function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export function mesDe(iso) {
  return iso.slice(0, 7);
}

export function labelMes(chaveMes) {
  const [ano, mes] = chaveMes.split("-");
  return MESES[Number(mes) - 1] + "/" + ano.slice(2);
}
