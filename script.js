// Gráfico de Barras

const barCtx = document.getElementById("barChart");

new Chart(barCtx, {
    type: "bar",
    data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        datasets: [
            {
                label: "Entradas",
                data: [4000, 5000, 4500, 6000, 7000, 8000],
                backgroundColor: "#0466c8"
            },
            {
                label: "Saídas",
                data: [2500, 3000, 2800, 3200, 2900, 2650],
                backgroundColor: "#002855"
            }
        ]
    }
});

// Gráfico Pizza

const pieCtx = document.getElementById("pieChart");

new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: [
            "Alimentação",
            "Moradia",
            "Transporte",
            "Lazer",
            "Outros"
        ],
        datasets: [{
            data: [900, 800, 400, 300, 250],
            backgroundColor: [
                "#0466c8",
                "#0353a4",
                "#023e7d",
                "#002855",
                "#5c677d"
            ]
        }]
    }
});