export const catMensalidades = {
  Moradia: "fa-house",
  Internet: "fa-wifi",
  Energia: "fa-bolt",
  Saúde: "fa-dumbbell",
  Streaming: "fa-tv",
  Educação: "fa-graduation-cap",
  Outros: "fa-receipt"
};

export function nomesCatMensalidades() {
  return Object.keys(catMensalidades);
}
