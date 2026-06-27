export function init() {
  const pagina = document.getElementById("page-ajustes");

  pagina.addEventListener("click", e => {
    const toggle = e.target.closest(".toggle");
    if (!toggle) return;

    const ligado = toggle.classList.toggle("is-on");
    toggle.setAttribute("aria-checked", ligado ? "true" : "false");
  });
}
