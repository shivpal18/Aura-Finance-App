let transactions = JSON.parse(localStorage.getItem("transactions")) || [
    {
        id: 1,
        title: "Salary",
        category: "Income",
        amount: 52000,
        type: "income",
        date: "2026-07-01"
    },

    {
        id: 2,
        title: "Netflix",
        category: "Entertainment",
        amount: 649,
        type: "expense",
        date: "2026-07-03"
    },

    {
        id: 3,
        title: "Swiggy",
        category: "Food",
        amount: 430,
        type: "expense",
        date: "2026-07-05"
    }
];

let loans = loadLoans();

let investments = loadInvestments();