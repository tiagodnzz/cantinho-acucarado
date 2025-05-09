document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const viewsChartCtx = document.getElementById("viewsChart").getContext("2d");
    const whatsappChartCtx = document.getElementById("whatsappChart").getContext("2d");
    const uniqueUsersChartCtx = document.getElementById("uniqueUsersChart").getContext("2d");
    const contactChartCtx = document.getElementById("contactChart").getContext("2d");

    let viewsChart, whatsappChart, contactChart, uniqueUsersChart;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = date => date.toISOString().split("T")[0];

    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    if (startDateInput && endDateInput) {
        startDateInput.value = formatDate(firstDayOfMonth);
        endDateInput.value = formatDate(lastDayOfMonth);
    }

    document.getElementById("apply-filter").addEventListener("click", () => {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        loadAnalytics(startDate, endDate);
    });

    document.getElementById("reset-filter").addEventListener("click", () => {
        startDateInput.value = "";
        endDateInput.value = "";
        loadAnalytics();
    });

    async function loadAnalytics(startDate = firstDayOfMonth, endDate = lastDayOfMonth) {
        try {
            let query = db.collection("analytics");

            if (startDate && endDate) {
                endDate.setHours(23, 59, 59, 999);
                query = query.where("timestamp", ">=", startDate).where("timestamp", "<=", endDate);
            }

            const snapshot = await query.get();
            const analyticsData = snapshot.docs.map(doc => doc.data());

            processAndRenderCharts(analyticsData, startDate, endDate);

        } catch (error) {
            console.error("Erro ao carregar dados do Firestore:", error);
        }
    }

    function processAndRenderCharts(data, startDate, endDate) {
        const pageViewsByDay = {};
        const whatsappClicksByDay = {};
        const uniqueUsersByDay = {};
        const contactClicksByDay = {};

        data.forEach(entry => {
            const dateObj = entry.timestamp.toDate();

            if (dateObj < startDate || dateObj > endDate) return;

            const date = dateObj.toLocaleDateString("pt-BR");

            if (entry.type === "pageView") {
                pageViewsByDay[date] = (pageViewsByDay[date] || 0) + 1;

                if (!uniqueUsersByDay[date]) uniqueUsersByDay[date] = new Set();
                uniqueUsersByDay[date].add(entry.userId);
            }

            if (entry.type === "click" && entry.metricName === "whatsappFloatClicks") {
                whatsappClicksByDay[date] = (whatsappClicksByDay[date] || 0) + 1;
            }

            if (entry.type === "click" && entry.metricName === "mainContactClicks") {
                contactClicksByDay[date] = (contactClicksByDay[date] || 0) + 1;
            }
        });

        const labels = [...new Set([
            ...Object.keys(pageViewsByDay),
            ...Object.keys(whatsappClicksByDay),
            ...Object.keys(contactClicksByDay),
            ...Object.keys(uniqueUsersByDay),
        ])].sort((a, b) => {
            const [diaA, mesA, anoA] = a.split('/').map(Number);
            const [diaB, mesB, anoB] = b.split('/').map(Number);
            return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
        });

        const viewsData = labels.map(label => pageViewsByDay[label] || 0);
        const whatsappData = labels.map(label => whatsappClicksByDay[label] || 0);
        const contactData = labels.map(label => contactClicksByDay[label] || 0);
        const uniqueUsersData = labels.map(label => uniqueUsersByDay[label]?.size || 0);

        renderChart(viewsChart, viewsChartCtx, "Visualizações do Site por Dia", labels, viewsData);
        renderChart(whatsappChart, whatsappChartCtx, "Cliques no Botão WhatsApp", labels, whatsappData);
        renderChart(contactChart, contactChartCtx, "Cliques no Formulário de Contato", labels, contactData);
        renderChart(uniqueUsersChart, uniqueUsersChartCtx, "Visitantes por Dia", labels, uniqueUsersData);
    }

    function renderChart(chart, ctx, title, labels, data) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: title,
                    data,
                    fill: true,
                    borderColor: '#ba865b',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: false, text: title }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });

        if (title.includes("Visualizações")) viewsChart = chart;
        else if (title.includes("WhatsApp")) whatsappChart = chart;
        else if (title.includes("Contato")) contactChart = chart;
        else if (title.includes("Usuários")) uniqueUsersChart = chart;
    }

    async function loadMonthlySummary() {
        const db = firebase.firestore();
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const snapshot = await db
            .collection("analytics")
            .where("timestamp", ">=", firstDay)
            .where("timestamp", "<=", lastDay)
            .get();

        const data = snapshot.docs.map(doc => doc.data());

        let views = 0, whatsapp = 0, contact = 0;
        const uniqueUsers = new Set();

        data.forEach(entry => {
            if (entry.type === "pageView") {
                views++;
                if (entry.userId) uniqueUsers.add(entry.userId);
            }
            if (entry.type === "click" && entry.metricName === "whatsappFloatClicks") whatsapp++;
            if (entry.type === "click" && entry.metricName === "mainContactClicks") contact++;
        });

        document.getElementById("monthly-views").textContent = views;
        document.getElementById("monthly-whatsapp").textContent = whatsapp;
        document.getElementById("monthly-contact").textContent = contact;
        document.getElementById("monthly-unique").textContent = uniqueUsers.size;

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const monthName = monthNames[now.getMonth()];
        const year = now.getFullYear();
        document.getElementById("monthly-title").textContent = `${monthName} ${year}`;
    }
    
    loadAnalytics(firstDayOfMonth, lastDayOfMonth); // Carrega dados com filtro do mês atual por padrão
    loadMonthlySummary(); // executa a carga dos dados do mês atual

});
