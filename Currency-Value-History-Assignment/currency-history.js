const apiKey = "CSFfrrII5w_8ex_CkKZols6VhoHpsbFP";
let chart = null;

function fetchCurrencyData() {
    clearErrors();

    const baseCurrency = document.getElementById("baseCurrency").value;
    const convertCurrency = document.getElementById("convertCurrency").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    let valid = true;

    if (!baseCurrency) {
        document.getElementById("baseError").innerText = "Base Currency is Required";
        valid = false;
    }

    if (!convertCurrency) {
        document.getElementById("convertError").innerText = "Convert To Currency is Required";
        valid = false;
    }

    if (!fromDate) {
        document.getElementById("fromDateError").innerText = "From Date is Required";
        valid = false;
    }

    if (!toDate) {
        document.getElementById("toDateError").innerText = "To Date is Required";
        valid = false;
    }

    if (!valid) return;

    const url = `https://api.polygon.io/v2/aggs/ticker/C:${baseCurrency}${convertCurrency}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert("No data available for selected dates.");
                return;
            }

            const values = data.results.map(item => item.c); // Closing price
            const dates = data.results.map(item => {
                const d = new Date(item.t);
                return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
            });

            drawChart(dates, values, baseCurrency, convertCurrency);
        })
        .catch(error => {
            console.error("API Error:", error);
            alert("Failed to retrieve data.");
        });
}

function drawChart(dates, values, baseCurrency, convertCurrency) {
    const ctx = document.getElementById("chartjs-0").getContext("2d");

    if (chart) {
        chart.destroy(); // clear previous chart
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: `One ${baseCurrency} to ${convertCurrency}`,
                data: values,
                fill: false,
                borderColor: "teal",
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `${baseCurrency} to ${convertCurrency}`,
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}

function clearErrors() {
    document.getElementById("baseError").innerText = "";
    document.getElementById("convertError").innerText = "";
    document.getElementById("fromDateError").innerText = "";
    document.getElementById("toDateError").innerText = "";
}

function clearForm() {
    document.getElementById("baseCurrency").value = "";
    document.getElementById("convertCurrency").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    clearErrors();

    if (chart) {
        chart.destroy();
        chart = null;
    }
}
