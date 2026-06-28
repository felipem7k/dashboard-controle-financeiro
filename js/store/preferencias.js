import { load, save } from "./storage.js";

const CHAVE = "financas:preferencias";

const PADRAO = {
  nome: "",
  email: "",
  toggles: {},
  selects: {}
};

export function getPreferencias() {
  return {
    ...PADRAO,
    ...load(CHAVE, {})
  };
}

export function salvarPreferencias(dados) {
  const atual = getPreferencias();
  save(CHAVE, {
    ...atual,
    ...dados
  });
}
