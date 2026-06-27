const iconesCategoria = {
  Alimentação: "fa-cart-shopping",
  Transporte: "fa-car",
  Lazer: "fa-film",
  Compras: "fa-bag-shopping",
  Streaming: "fa-tv",
  Outros: "fa-receipt"
};

const cartoes = [
  {
    id: "nubank",
    nome: "Nubank",
    bandeira: "fa-cc-mastercard",
    final: "1234",
    titular: "Felipe Machado",
    limite: 5000,
    vencimento: "10/jul",
    fechamento: "03/jul",
    compras: [
      {
        desc: "Mercado",
        categoria: "Alimentação",
        data: "24 jun",
        valor: 320
      },
      {
        desc: "Uber",
        categoria: "Transporte",
        data: "22 jun",
        valor: 45
      },
      {
        desc: "Amazon",
        categoria: "Compras",
        data: "20 jun",
        valor: 189.9
      },
      {
        desc: "Spotify",
        categoria: "Streaming",
        data: "18 jun",
        valor: 21.9
      },
      {
        desc: "Restaurante",
        categoria: "Alimentação",
        data: "15 jun",
        valor: 130
      }
    ]
  },
  {
    id: "inter",
    nome: "Inter",
    bandeira: "fa-cc-visa",
    final: "5678",
    titular: "Felipe Machado",
    limite: 3000,
    vencimento: "15/jul",
    fechamento: "08/jul",
    compras: [
      {
        desc: "Posto Shell",
        categoria: "Transporte",
        data: "23 jun",
        valor: 240
      },
      {
        desc: "Cinema",
        categoria: "Lazer",
        data: "21 jun",
        valor: 60
      },
      {
        desc: "Farmácia",
        categoria: "Outros",
        data: "17 jun",
        valor: 78.5
      }
    ]
  },
  {
    id: "c6",
    nome: "C6 Bank",
    bandeira: "fa-cc-mastercard",
    final: "9012",
    titular: "Felipe Machado",
    limite: 8000,
    vencimento: "20/jul",
    fechamento: "13/jul",
    compras: [
      {
        desc: "Notebook",
        categoria: "Compras",
        data: "19 jun",
        valor: 3200
      },
      {
        desc: "iFood",
        categoria: "Alimentação",
        data: "16 jun",
        valor: 54.9
      }
    ]
  }
];

let ativo = cartoes[0].id;

function formatar(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function totalFatura(cartao) {
  return cartao.compras.reduce((soma, c) => soma + c.valor, 0);
}

function renderSeletor() {
  const alvo = document.getElementById("card-selector");
  alvo.innerHTML = cartoes
    .map(cartao => {
      const classe = cartao.id === ativo ? "card-chip is-active" : "card-chip";
      return `<button class="${classe}" type="button" data-id="${cartao.id}">
        <i class="card-chip-icon fa-brands ${cartao.bandeira}"></i>
        <span>
          <span class="card-chip-name">${cartao.nome}</span>
          <span class="card-chip-last"> •••• ${cartao.final}</span>
        </span>
      </button>`;
    })
    .join("");
}

function renderCartao(cartao) {
  document.getElementById("credit-card").innerHTML = `
    <div class="cc-top">
      <span class="cc-brand">${cartao.nome}</span>
      <span class="cc-chip"></span>
    </div>
    <div class="cc-number">•••• •••• •••• ${cartao.final}</div>
    <div class="cc-bottom">
      <div>
        <div class="cc-label">Titular</div>
        <div class="cc-name">${cartao.titular}</div>
      </div>
      <span class="cc-flag"><i class="fa-brands ${cartao.bandeira}"></i></span>
    </div>`;
}

function renderLimite(cartao) {
  const usado = totalFatura(cartao);
  const pct = Math.round((usado / cartao.limite) * 100);

  document.getElementById("card-limit").innerHTML = `
    <div class="limit-head">
      <span>Limite usado</span>
      <span>${pct}%</span>
    </div>
    <div class="limit-bar">
      <div class="limit-fill" style="width: ${pct}%"></div>
    </div>
    <div class="limit-foot">
      R$ ${formatar(usado)} <span class="muted">de R$ ${formatar(cartao.limite)}</span>
    </div>`;
}

function renderFatura(cartao) {
  document.getElementById("card-invoice-total").textContent = "R$ " + formatar(totalFatura(cartao));
  document.getElementById("card-due").textContent = cartao.vencimento;
  document.getElementById("card-close").textContent = cartao.fechamento;
}

function renderCompras(cartao) {
  const alvo = document.getElementById("card-purchases-list");
  alvo.innerHTML = cartao.compras
    .map(compra => {
      const icone = iconesCategoria[compra.categoria] || "fa-receipt";
      return `<li class="recent-item">
        <span class="recent-icon down"><i class="fa-solid ${icone}"></i></span>
        <div class="recent-info">
          <span class="recent-desc">${compra.desc}</span>
          <span class="recent-date">${compra.categoria} · ${compra.data}</span>
        </div>
        <span class="recent-value down">- R$ ${formatar(compra.valor)}</span>
      </li>`;
    })
    .join("");
}

function render() {
  const cartao = cartoes.find(c => c.id === ativo);
  renderSeletor();
  renderCartao(cartao);
  renderLimite(cartao);
  renderFatura(cartao);
  renderCompras(cartao);
}

export function init() {
  document.getElementById("card-selector").addEventListener("click", e => {
    const chip = e.target.closest(".card-chip");
    if (!chip) return;

    ativo = chip.dataset.id;
    render();
  });

  render();
}
