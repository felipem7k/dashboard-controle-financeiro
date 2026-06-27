export function abrirModal({ titulo, conteudo, onConfirmar }) {
  const aberturaFoco = document.activeElement;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const box = document.createElement("div");
  box.className = "modal-box";

  const tituloEl = document.createElement("div");
  tituloEl.className = "modal-title";
  tituloEl.textContent = titulo;

  const body = document.createElement("div");
  body.className = "modal-body";
  body.appendChild(conteudo);

  const erroEl = document.createElement("div");
  erroEl.className = "modal-erro";

  const acoes = document.createElement("div");
  acoes.className = "modal-actions";

  const btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.className = "modal-btn";
  btnCancelar.textContent = "Cancelar";

  const btnSalvar = document.createElement("button");
  btnSalvar.type = "button";
  btnSalvar.className = "modal-btn primary";
  btnSalvar.textContent = "Salvar";

  acoes.append(btnCancelar, btnSalvar);
  box.append(tituloEl, body, erroEl, acoes);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const primeiroCampo = conteudo.querySelector("input, select, textarea");
  if (primeiroCampo) primeiroCampo.focus();

  function fechar() {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
    if (aberturaFoco) aberturaFoco.focus();
  }

  function mostrarErro(msg) {
    erroEl.textContent = msg;
  }

  function confirmar() {
    erroEl.textContent = "";
    try {
      onConfirmar(mostrarErro);
      fechar();
    } catch (e) {
      mostrarErro(e.message);
    }
  }

  function onKey(e) {
    if (e.key === "Escape") fechar();
  }

  btnCancelar.addEventListener("click", fechar);
  btnSalvar.addEventListener("click", confirmar);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) fechar();
  });
  document.addEventListener("keydown", onKey);

  return { fechar };
}
