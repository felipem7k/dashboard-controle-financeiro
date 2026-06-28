export function load(chave, fallback) {
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto === null) return fallback;
    return JSON.parse(bruto);
  } catch {
    return fallback;
  }
}

export function save(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
    return;
  }
}
