function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function loadTransactions() {
    const storedTransactions = JSON.parse(
        localStorage.getItem("transactions")
    );
    if (storedTransactions) {
        transactions = storedTransactions;
    }
}

let monthlyBudget =
    Number(localStorage.getItem("monthlyBudget")) || 0;

function saveBudget() {
    localStorage.setItem(
        "monthlyBudget",
        monthlyBudget
    );
}

let savingsGoal =
    Number(localStorage.getItem("savingsGoal")) || 0;

function saveGoal() {
    localStorage.setItem(
        "savingsGoal",
        savingsGoal
    );
}

let profileName =
    localStorage.getItem("profileName") || "Shivpal";

function saveProfile(){
    localStorage.setItem(
        "profileName",
        profileName
    );
}

let currency =
    localStorage.getItem("currency") || "₹";

function saveCurrency(){
    localStorage.setItem(
        "currency",
        currency
    );
}

let recurringTransactions =
    JSON.parse(
        localStorage.getItem(
            "recurringTransactions"
        )
    ) || [];

function saveRecurringTransactions(){
    localStorage.setItem(
        "recurringTransactions",
        JSON.stringify(
            recurringTransactions
        )
    );
}

const exchangeRates = {
    "₹": 1,
    "$": 0.0116,
    "€": 0.0099,
    "£": 0.0086
};

let theme =
    localStorage.getItem("theme") || "dark";

function saveTheme(){
    localStorage.setItem(
        "theme",
        theme
    );
}

function saveLoans(loans){
    localStorage.setItem(
        "loans",
        JSON.stringify(loans)
    );
}

function loadLoans(){
    return JSON.parse(
        localStorage.getItem("loans")
    ) || [];
}

function saveInvestments(){
    localStorage.setItem(
        "investments",
        JSON.stringify(
            investments
        )
    );
}

function loadInvestments(){
    return JSON.parse(
        localStorage.getItem(
            "investments"
        )
    ) || [];
}