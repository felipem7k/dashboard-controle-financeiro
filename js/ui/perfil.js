import { getPreferencias } from "../store/preferencias.js";

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function aplicarPerfil() {
  const pref = getPreferencias();
  if (!pref.nome && !pref.email) return;

  const nome = pref.nome || "Sem nome";
  const email = pref.email || "—";
  const sigla = pref.nome ? iniciais(pref.nome) : "?";

  const sideNome = document.getElementById("side-nome");
  const sideMail = document.getElementById("side-mail");
  const sideAvatar = document.getElementById("side-avatar");
  const topAvatar = document.getElementById("top-avatar");
  const perfilAvatar = document.getElementById("perfil-avatar");

  if (sideNome) sideNome.textContent = nome;
  if (sideMail) sideMail.textContent = email;
  if (sideAvatar) sideAvatar.textContent = sigla;
  if (topAvatar) topAvatar.textContent = sigla;
  if (perfilAvatar) perfilAvatar.textContent = sigla;
}
