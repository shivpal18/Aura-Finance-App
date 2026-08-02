let expenseChart;
let incomeExpenseChart;
let categoryChart;

// ===========================
// Dashboard Line Chart 
// ===========================

function getMonthlyExpenses() {
    const monthlyData =
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    transactions.forEach(transaction => {
        if (
            transaction.type === "expense" &&
            transaction.date
        ) {
            const month =
                new Date(transaction.date).getMonth();
            monthlyData[month] += transaction.amount;
        }
    });
    return monthlyData;
}

function initializeChart() {
    const ctx =
        document.getElementById("expenseChart");
    if (!ctx) return;
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            datasets: [{
                label: "Expenses",
                data: getMonthlyExpenses(),
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59,130,246,.15)",
                fill: true,
                tension: .4
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

}

function updateChart() {
    if (!expenseChart) return;
    expenseChart.data.datasets[0].data =
        getMonthlyExpenses();
    expenseChart.update();
}

// ===========================
// Analytics
// ===========================

function initializeAnalyticsCharts() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    // Cards
    const incomeEl =
        document.getElementById("analyticsIncome");
    const expenseEl =
        document.getElementById("analyticsExpense");
    const balanceEl =
        document.getElementById("analyticsBalance");
    const totalEl =
        document.getElementById("analyticsTransactions");
    if (incomeEl)
        incomeEl.textContent =
            formatCurrency(income);
    if (expenseEl)
        expenseEl.textContent =
            formatCurrency(expense);
    if (balanceEl)
        balanceEl.textContent =
            formatCurrency(income - expense);
    if (totalEl)
        totalEl.textContent =
            transactions.length;

    // =====================
    // Income vs Expense
    // =====================
    const incomeCtx =
        document.getElementById("incomeExpenseChart");
    if (incomeCtx) {
        if (incomeExpenseChart) {
            incomeExpenseChart.destroy();
        }
        incomeExpenseChart = new Chart(incomeCtx, {
            type: "bar",
            data: {
                labels: [
                    "Income",
                    "Expense"
                ],
                datasets: [{
                    data: [
                        income,
                        expense
                    ],
                    backgroundColor: [
                        "#22C55E",
                        "#EF4444"
                    ],
                    borderRadius: 8
                }]
            },

            options:{
                responsive:true,
                maintainAspectRatio:false,
                scales:{
                    x:{
                        grid:{
                            display:false
                        },
                        ticks:{
                            color:"#9CA3AF"
                        }
                    },

                    y:{
                        beginAtZero:true,
                        grid:{
                            color:"rgba(255,255,255,.05)"
                        },
                        ticks:{
                            color:"#9CA3AF"
                        }
                    }
                },

                plugins:{
                    legend:{
                        display:false
                    }
                }
            }
        });
    }

    // =====================
    // Expense by Category
    // =====================

    const expenseCategories = {};
    transactions
        .filter(t => t.type === "expense")
        .forEach(transaction => {
            expenseCategories[
                transaction.category
            ] =
                (expenseCategories[
                    transaction.category
                ] || 0)
                + transaction.amount;
        });

    const categoryCtx =
        document.getElementById("categoryChart");
    if (categoryCtx) {
        if (categoryChart) {
            categoryChart.destroy();
        }
        categoryChart = new Chart(categoryCtx, {
            type: "pie",
            data: {
                labels:
                    Object.keys(expenseCategories),
                datasets: [{
                    data:
                        Object.values(expenseCategories),
                    backgroundColor: [
                        "#3B82F6",
                        "#22C55E",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                        "#06B6D4"
                    ]
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#E5E7EB",
                            padding: 20,
                            boxWidth: 18
                        }
                    }
                }
            }
        });
    }
}

let investmentChart;

function updateInvestmentChart() {
    const canvas =
        document.getElementById("investmentChart");
    if (!canvas) return;
    const totals = {};
    investments.forEach(item => {
        totals[item.type] =
            (totals[item.type] || 0) + item.amount;
    });
    const labels = Object.keys(totals);
    const values = Object.values(totals);
    if (investmentChart) {
        investmentChart.destroy();
    }
    if (labels.length === 0) {
        return;
    }
    investmentChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#3B82F6",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                    "#06B6D4"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            cutout: "65%",
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: "#E5E7EB"
                    }
                }
            }
        }
    });
}