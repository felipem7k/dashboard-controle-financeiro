export const catAssinaturas = {
  Streaming: {
    icon: "fa-clapperboard",
    cor: "#E50914"
  },
  Música: {
    icon: "fa-music",
    cor: "#1DB954"
  },
  IA: {
    icon: "fa-robot",
    cor: "#10A37F"
  },
  Armazenamento: {
    icon: "fa-cloud",
    cor: "#5c677d"
  },
  Outros: {
    icon: "fa-rotate",
    cor: "#0466c8"
  }
};

export function nomesCatAssinaturas() {
  return Object.keys(catAssinaturas);
}
