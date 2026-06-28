import { hoje } from "../utils/datas.js";
import { getPreferencias, salvarPreferencias } from "../store/preferencias.js";
import { aplicarPerfil } from "../ui/perfil.js";

const PREFIXO = "financas:";

function coletarDados() {
  const dados = {};
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave && chave.startsWith(PREFIXO)) {
      try {
        dados[chave] = JSON.parse(localStorage.getItem(chave));
      } catch {
        dados[chave] = localStorage.getItem(chave);
      }
    }
  }
  return dados;
}

function exportar() {
  const conteudo = JSON.stringify(coletarDados(), null, 2);
  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "financas-backup-" + hoje() + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function limpar() {
  if (!confirm("Isso apaga TODOS os seus dados permanentemente. Continuar?")) return;

  const chaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave && chave.startsWith(PREFIXO)) chaves.push(chave);
  }
  chaves.forEach(c => localStorage.removeItem(c));
  location.reload();
}

function restaurar() {
  const pref = getPreferencias();

  document.getElementById("set-nome").value = pref.nome || "";
  document.getElementById("set-email").value = pref.email || "";

  document.querySelectorAll("#page-ajustes .toggle").forEach(toggle => {
    const chave = toggle.getAttribute("aria-label");
    if (chave in pref.toggles) {
      const ligado = pref.toggles[chave];
      toggle.classList.toggle("is-on", ligado);
      toggle.setAttribute("aria-checked", ligado ? "true" : "false");
    }
  });

  document.querySelectorAll("#page-ajustes [data-pref]").forEach(select => {
    const chave = select.dataset.pref;
    if (chave in pref.selects) {
      select.value = pref.selects[chave];
    }
  });
}

function salvarToggle(toggle) {
  const pref = getPreferencias();
  pref.toggles[toggle.getAttribute("aria-label")] = toggle.classList.contains("is-on");
  salvarPreferencias({ toggles: pref.toggles });
}

function salvarSelect(select) {
  const pref = getPreferencias();
  pref.selects[select.dataset.pref] = select.value;
  salvarPreferencias({ selects: pref.selects });
}

function salvarPerfil() {
  salvarPreferencias({
    nome: document.getElementById("set-nome").value.trim(),
    email: document.getElementById("set-email").value.trim()
  });
  aplicarPerfil();
}

export function init() {
  const pagina = document.getElementById("page-ajustes");

  pagina.addEventListener("click", e => {
    const toggle = e.target.closest(".toggle");
    if (!toggle) return;

    const ligado = toggle.classList.toggle("is-on");
    toggle.setAttribute("aria-checked", ligado ? "true" : "false");
    salvarToggle(toggle);
  });

  pagina.addEventListener("change", e => {
    const select = e.target.closest("[data-pref]");
    if (select) salvarSelect(select);
  });

  document.getElementById("btn-salvar-perfil").addEventListener("click", salvarPerfil);
  document.getElementById("btn-exportar").addEventListener("click", exportar);
  document.getElementById("btn-limpar").addEventListener("click", limpar);

  restaurar();
}
