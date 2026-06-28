import { getAll, subscribe } from "../store/transacoes.js";
import { categorias } from "../store/categorias.js";
import { formatar } from "../utils/moeda.js";
import { formatarData, hoje, mesDe, labelMes } from "../utils/datas.js";

const gridColor = "#252a35";
const textColor = "#8a8f98";

function mesAtual() {
  return mesDe(hoje());
}

function mesAnterior() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 7);
}

function somaPorTipo(lista, tipo) {
  return lista
    .filter(tx => tx.tipo === tipo)
    .reduce((soma, tx) => soma + tx.valor, 0);
}

function doMes(chaveMes) {
  return getAll().filter(tx => mesDe(tx.data) === chaveMes);
}

function delta(atual, anterior) {
  if (anterior <= 0) return null;
  return ((atual - anterior) / anterior) * 100;
}

function htmlDelta(valor, inverter) {
  if (valor === null) {
    return `<span class="kpi-delta muted">— vs. mês anterior</span>`;
  }
  const positivo = valor >= 0;
  const bom = inverter ? !positivo : positivo;
  const dir = bom ? "up" : "down";
  const seta = positivo ? "fa-arrow-up" : "fa-arrow-down";
  return `<span class="kpi-delta ${dir}"><i class="fa-solid ${seta}"></i> ${Math.abs(valor).toFixed(0)}% vs. mês anterior</span>`;
}

function renderKpis() {
  const atuais = doMes(mesAtual());
  const anteriores = doMes(mesAnterior());

  const receitas = somaPorTipo(atuais, "entrada");
  const despesas = somaPorTipo(atuais, "saida");
  const saldo = receitas - despesas;
  const poupanca = receitas > 0 ? (saldo / receitas) * 100 : null;

  const recAnt = somaPorTipo(anteriores, "entrada");
  const despAnt = somaPorTipo(anteriores, "saida");
  const saldoAnt = recAnt - despAnt;

  document.getElementById("kpi-saldo").textContent = "R$ " + formatar(saldo);
  document.getElementById("kpi-receitas").textContent = "R$ " + formatar(receitas);
  document.getElementById("kpi-despesas").textContent = "R$ " + formatar(despesas);
  document.getElementById("kpi-economia").textContent = poupanca === null ? "—" : poupanca.toFixed(0) + "%";

  document.getElementById("kpi-saldo-delta").innerHTML = htmlDelta(delta(saldo, saldoAnt), false);
  document.getElementById("kpi-receitas-delta").innerHTML = htmlDelta(delta(receitas, recAnt), false);
  document.getElementById("kpi-despesas-delta").innerHTML = htmlDelta(delta(despesas, despAnt), true);
  document.getElementById("kpi-economia-delta").innerHTML = "";
}

function renderRecentes() {
  const alvo = document.getElementById("recent-list");
  const lista = getAll().slice(0, 4);

  if (lista.length === 0) {
    alvo.innerHTML = `<li class="recent-empty">Nenhuma transação ainda.</li>`;
    return;
  }

  alvo.innerHTML = lista
    .map(tx => {
      const entrada = tx.tipo === "entrada";
      const dir = entrada ? "up" : "down";
      const seta = entrada ? "fa-arrow-down" : "fa-arrow-up";
      const sinal = entrada ? "+" : "-";
      return `<li class="recent-item">
        <span class="recent-icon ${dir}"><i class="fa-solid ${seta}"></i></span>
        <div class="recent-info">
          <span class="recent-desc">${tx.desc}</span>
          <span class="recent-date">${formatarData(tx.data)}</span>
        </div>
        <span class="recent-value ${dir}">${sinal} R$ ${formatar(tx.valor)}</span>
      </li>`;
    })
    .join("");
}

const coresPizza = ["#0466c8", "#0353a4", "#023e7d", "#002855", "#5c677d", "#4a9be8"];

let barChart = null;
let pieChart = null;

function ultimosSeisMeses() {
  const meses = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(d.getFullYear(), d.getMonth() - i, 1);
    meses.push(ref.toISOString().slice(0, 7));
  }
  return meses;
}

function dadosBarras() {
  const meses = ultimosSeisMeses();
  const lista = getAll();
  const entradas = meses.map(m =>
    lista.filter(tx => mesDe(tx.data) === m && tx.tipo === "entrada").reduce((s, tx) => s + tx.valor, 0)
  );
  const saidas = meses.map(m =>
    lista.filter(tx => mesDe(tx.data) === m && tx.tipo === "saida").reduce((s, tx) => s + tx.valor, 0)
  );
  return {
    labels: meses.map(labelMes),
    entradas,
    saidas
  };
}

function dadosPizza() {
  const atuais = doMes(mesAtual()).filter(tx => tx.tipo === "saida");
  const porCategoria = {};
  atuais.forEach(tx => {
    porCategoria[tx.categoria] = (porCategoria[tx.categoria] || 0) + tx.valor;
  });
  const labels = Object.keys(porCategoria);
  return {
    labels,
    valores: labels.map(c => porCategoria[c])
  };
}

function renderBarras() {
  const dados = dadosBarras();
  if (barChart) barChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: dados.labels,
      datasets: [
        {
          label: "Entradas",
          data: dados.entradas,
          backgroundColor: "#0466c8",
          borderRadius: 6
        },
        {
          label: "Saídas",
          data: dados.saidas,
          backgroundColor: "#002855",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        }
      }
    }
  });
}

function renderPizza() {
  const dados = dadosPizza();
  if (pieChart) pieChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: dados.labels,
      datasets: [
        {
          data: dados.valores,
          backgroundColor: dados.labels.map((c, i) => coresPizza[i % coresPizza.length]),
          borderColor: "#13161c",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
            padding: 14
          }
        }
      }
    }
  });
}

function render() {
  renderKpis();
  renderRecentes();
  renderBarras();
  renderPizza();
}

export function init() {
  subscribe(render);
  render();
}
