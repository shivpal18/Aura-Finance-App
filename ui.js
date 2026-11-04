function formatCurrency(amount){
    const convertedAmount =
        Number(amount) *
        exchangeRates[currency];
    return `${currency}${convertedAmount.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;
}

function updateOverviewCards() {
    let income = 0;
    let expense = 0;
    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });
    const balance = income - expense;
    const saving = balance;
    document.getElementById("income").textContent =
        formatCurrency(income)
    document.getElementById("expense").textContent =
        formatCurrency(expense)
    document.getElementById("balance").textContent =
        formatCurrency(balance)
    document.getElementById("saving").textContent =
        formatCurrency(saving)

    // ===========================
    // Sidebar Net Worth
    // ===========================

    const totalInvestment =
        investments.reduce(
            (sum, item) =>
                sum + Number(item.currentValue),
            0
        );

    const remainingLoan =
        loans.reduce(
            (sum, loan) =>
                sum +
                Math.max(
                    loan.amount -
                    (loan.paidEmi * loan.emi),
                    0
                ),
            0
        );

    const netWorth =
        balance +
        totalInvestment -
        remainingLoan;

    const sidebarNetWorth =
        document.getElementById(
            "sidebarNetWorth"
        );

    if (sidebarNetWorth) {
        sidebarNetWorth.textContent =
            formatCurrency(netWorth);
    }
}

const modal = document.getElementById("transactionModal");
const openBtns =
    document.querySelectorAll(".new-transaction-btn");
const closeBtn =
    document.querySelector(".close-modal");

openBtns.forEach(button => {
    button.addEventListener(
        "click",
        openModal
    );
});

closeBtn.addEventListener(
    "click",
    closeModal
);

modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});

function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

function updateBudget() {
    const budget =
        document.getElementById("totalBudget");
    const spent =
        document.getElementById("budgetSpent");
    const remaining =
        document.getElementById("budgetRemaining");
    const progress =
        document.getElementById("budgetProgress");
    const status =
        document.getElementById("budgetStatus");
    if (!budget) return;
    const totalExpense =
        transactions
            .filter(t => t.type === "expense")
            .reduce(
                (sum, t) => sum + t.amount,
                0
            );

    const left =
        monthlyBudget - totalExpense;
    budget.textContent =
        formatCurrency(monthlyBudget);
    spent.textContent =
        formatCurrency(totalExpense);
    remaining.textContent =
        formatCurrency(left);

    let percent = 0;
    if (monthlyBudget > 0) {
        percent =
            (totalExpense / monthlyBudget) * 100;
    }
    percent = Math.min(percent, 100);
    requestAnimationFrame(() => {
        progress.style.width = `${percent}%`;
    });

    document.getElementById("budgetPercent").textContent =
        `${Math.round(percent)}%`;
    if (monthlyBudget === 0) {
        status.textContent =
            "No budget set";
        progress.style.background =
            "#3B82F6";
        return;
    }
    if (percent < 80) {
        status.innerHTML =
            "<span style='color:#22C55E'>●</span> You are within budget";
        progress.style.background =
            "#22C55E";
    }
    else if (percent < 100) {
        status.innerHTML =
            "<span style='color:#F59E0B'>●</span> Budget almost reached";
        progress.style.background =
            "#F59E0B";
    }
    else {
        status.innerHTML =
            "<span style='color:#EF4444'>●</span> Budget exceeded";
        progress.style.background =
            "#EF4444";
    }
}


function updateGoal() {
    const goal =
        document.getElementById("goalTotal");
    const current =
        document.getElementById("goalCurrent");
    const remaining =
        document.getElementById("goalRemaining");
    const progress =
        document.getElementById("goalProgress");
    const percent =
        document.getElementById("goalPercent");
    const status =
        document.getElementById("goalStatus");
    if (!goal) return;
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const savings = income - expense;
    goal.textContent =
        formatCurrency(savingsGoal);
    current.textContent =
        formatCurrency(savings);
    remaining.textContent =
        formatCurrency(
            Math.max(
                savingsGoal - savings,
                0
            )
        );

    let value = 0;
    if (savingsGoal > 0) {
        value =
            (savings / savingsGoal) * 100;
    }
    value = Math.min(value,100);
    progress.style.width =
        `${value}%`;
    percent.textContent =
        `${Math.round(value)}%`;

    if (savingsGoal === 0) {
        status.textContent =
            "No Goal Set";
        progress.style.background =
            "#3B82F6";
        return;
    }
    if (value >= 100) {
        status.textContent =
            "🎉 Goal Achieved";
        progress.style.background =
            "#22C55E";
    }
    else {
        status.textContent =
            "Keep Saving 💰";
        progress.style.background =
            "#3B82F6";
    }
}

function updateReports(){
    const income = transactions
        .filter(t=>t.type==="income")
        .reduce((sum,t)=>sum+t.amount,0);
    const expense = transactions
        .filter(t=>t.type==="expense")
        .reduce((sum,t)=>sum+t.amount,0);
    const savings = income-expense;
    document.getElementById("reportIncome").textContent =
        formatCurrency(income);
    document.getElementById("reportExpense").textContent =
        formatCurrency(expense);
    document.getElementById("reportSavings").textContent =
        formatCurrency(savings);
    document.getElementById("reportTransactions").textContent =
        transactions.length;
}

function exportCSV(){
    let csv =
        "Title,Category,Type,Amount,Date\n";
    transactions.forEach(transaction=>{
        csv +=
            `${transaction.title},`+
            `${transaction.category},`+
            `${transaction.type},`+
            `${transaction.amount},`+
            `${transaction.date}\n`;
    });

    const blob =
        new Blob([csv],{
            type:"text/csv"
        });
    const url =
        URL.createObjectURL(blob);
    const a =
        document.createElement("a");
    a.href = url;
    a.download =
        "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);

    showToast(
        "CSV Exported",
        "Transactions exported successfully.",
        "success"
    );
}

function exportPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const income = transactions
        .filter(t=>t.type==="income")
        .reduce((sum,t)=>sum+t.amount,0);
    const expense = transactions
        .filter(t=>t.type==="expense")
        .reduce((sum,t)=>sum+t.amount,0);
    const savings = income-expense;

    doc.setFontSize(22);
    doc.text(
        "AURA Finance Report",
        20,
        20
    );
    doc.setFontSize(12);
    doc.text(
        `Generated : ${new Date().toLocaleDateString()}`,
        20,
        30
    );
    doc.line(
        20,
        35,
        190,
        35
    );
    doc.text(
        `Income : ${formatCurrency(income)}`,
        20,
        50
    );
    doc.text(
        `Expense : ${formatCurrency(expense)}`,
        20,
        60
    );
    doc.text(
        `Savings : ${formatCurrency(savings)}`,
        20,
        70
    );
    doc.text(
        `Transactions : ${transactions.length}`,
        20,
        80
    );

    let y = 100;
    doc.setFontSize(16);
    doc.text(
        "Transaction List",
        20,
        y
    );
    y += 10;
    doc.setFontSize(11);
    transactions.forEach((transaction,index)=>{
        doc.text(
            `${index+1}. ${transaction.title} | ${transaction.category} | ${transaction.type} | ${formatCurrency(transaction.amount)}`,
            20,
            y
        );
        y += 8;
        if(y>280){
            doc.addPage();
            y=20;
        }
    });

    doc.save("AURA-Finance-Report.pdf");

    showToast(
        "PDF Exported",
        "Report exported successfully.",
        "success"
    );
}

let selectedCalendarDate = null;

function renderCalendar(){
    const monthTitle =
        document.getElementById("calendarMonth");
    const calendarGrid =
        document.getElementById("calendarGrid");
    if(!monthTitle || !calendarGrid) return;
    calendarGrid.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const months = [
        "January","February","March",
        "April","May","June",
        "July","August","September",
        "October","November","December"
    ];

    monthTitle.textContent =
        `${months[month]} ${year}`;
    const firstDay =
        new Date(year,month,1).getDay();
    const totalDays =
        new Date(year,month+1,0).getDate();
    for(let i=0;i<firstDay;i++){
        const empty =
            document.createElement("div");
        calendarGrid.appendChild(empty);
    }

    const today = new Date();
    for(let day=1;day<=totalDays;day++){
        const cell =
            document.createElement("div");
        cell.className = "calendar-day";
        const formattedDate =
        `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        cell.dataset.date = formattedDate;
        cell.innerHTML = `
            <div class="calendar-date">
                ${day}
            </div>
            <div class="calendar-dots"></div>
        `;
        if(
            day===today.getDate() &&
            month===today.getMonth() &&
            year===today.getFullYear()
        ){
            cell.classList.add("today");
        }
        if(
            selectedCalendarDate === formattedDate
        ){
            cell.classList.add(
                "selected-day"
            );
        }
        cell.addEventListener("click",()=>{
            selectedCalendarDate =
                cell.dataset.date;
            renderCalendar();
            showCalendarTransactions(
                selectedCalendarDate
            );
        });
        const dayTransactions = transactions.filter(
            transaction => transaction.date === formattedDate
        );
        const dots = cell.querySelector(".calendar-dots");
        const hasIncome = dayTransactions.some(
            transaction => transaction.type === "income"
        );
        const hasExpense = dayTransactions.some(
            transaction => transaction.type === "expense"
        );
        if(hasIncome){
            const incomeDot = document.createElement("span");
            incomeDot.className = "calendar-dot income";
            dots.appendChild(incomeDot);
        }
        if(hasExpense){
            const expenseDot = document.createElement("span");
            expenseDot.className = "calendar-dot expense";
            dots.appendChild(expenseDot);
        }
        calendarGrid.appendChild(cell);
    }
    updateCalendarSummary();
}

function showCalendarTransactions(date){
    const container =
        document.getElementById(
            "calendarTransactionList"
        );
    if(!container) return;
    const filtered =
        transactions.filter(
            transaction =>
            transaction.date === date
        );
    if(filtered.length===0){
        container.innerHTML =
        `
        <div class="calendar-empty">
            <h3>
                📅
            </h3>
            <p>
                No transactions found for this date.
            </p>
        </div>
        `;
        return;
    }

    const formattedHeading =
        new Date(date).toLocaleDateString(
            "en-IN",
            {
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

    container.innerHTML =
    `
    <h3 class="calendar-transaction-heading">
        Transactions for ${formattedHeading}
    </h3>
    `;
    filtered.forEach(transaction=>{
        container.innerHTML +=
        `
        <div class="calendar-transaction-item">
            <div>
                <strong>
                    ${transaction.title}
                </strong>
                <p>
                    ${transaction.category}
                </p>
            </div>
            <h3 class="${transaction.type}">
                ${formatCurrency(transaction.amount)}
            </h3>
        </div>
        `;
    });
}

function updateCalendarSummary(){
    const incomeEl =
        document.getElementById("calendarIncome");
    const expenseEl =
        document.getElementById("calendarExpense");
    const transactionEl =
        document.getElementById("calendarTransactions");
    if(!incomeEl || !expenseEl || !transactionEl) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthlyTransactions = transactions.filter(transaction=>{
        const date = new Date(transaction.date);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    });
    const income = monthlyTransactions
        .filter(t=>t.type==="income")
        .reduce((sum,t)=>sum+t.amount,0);
    const expense = monthlyTransactions
        .filter(t=>t.type==="expense")
        .reduce((sum,t)=>sum+t.amount,0);
    incomeEl.textContent =
        formatCurrency(income);
    expenseEl.textContent =
        formatCurrency(expense);
    transactionEl.textContent =
        monthlyTransactions.length;
}

function updateProfile(){
    const input =
        document.getElementById("profileName");
    if(input){
        input.value = profileName;
    }
    const welcome =
        document.querySelector(".welcome h2");
    if(welcome){
        welcome.textContent =
        `Good Evening, ${profileName} 👋`;
    }
    const sidebarName =
        document.querySelector(".profile-info h3");
    if(sidebarName){
        sidebarName.textContent =
            profileName;
    }
    const initials =
        profileName
        .split(" ")
        .map(word=>word[0])
        .join("")
        .substring(0,2)
        .toUpperCase();
    const sidebarAvatar =
        document.querySelector(".profile-avatar");
    const topAvatar =
        document.querySelector(".user-avatar");
    if(sidebarAvatar){
        sidebarAvatar.textContent =
            initials;
    }

    if(topAvatar){
        topAvatar.textContent =
            initials;
    }
}

function updateCurrency(){
    const select =
        document.getElementById(
            "currencySelect"
        );
    if(select){
        select.value = currency;
    }
}

function exportBackup(){
    const backupData = {
        transactions,
        monthlyBudget,
        savingsGoal,
        profileName,
        currency,
        theme:
            localStorage.getItem("theme") || "light"
    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    backupData,
                    null,
                    2
                )
            ],
            {
                type:"application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);
    const a =
        document.createElement("a");
    a.href = url;
    a.download =
        `AURA-Backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(
        "Backup Exported",
        "Backup downloaded successfully.",
        "success"
    );
}

function importBackup(file){
    const reader = new FileReader();
    reader.onload = function(e){
        try{
            const data =
                JSON.parse(e.target.result);
            transactions =
                data.transactions || [];
            monthlyBudget =
                data.monthlyBudget || 0;
            savingsGoal =
                data.savingsGoal || 0;
            profileName =
                data.profileName || "User";
            currency =
                data.currency || "₹";
            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );
            localStorage.setItem(
                "monthlyBudget",
                monthlyBudget
            );
            localStorage.setItem(
                "savingsGoal",
                savingsGoal
            );
            localStorage.setItem(
                "profileName",
                profileName
            );
            localStorage.setItem(
                "currency",
                currency
            );
            updateProfile();
            updateCurrency();
            updateOverviewCards();
            updateBudget();
            updateGoal();
            updateReports();
            renderTransactions();
            renderAllTransactions();
            renderCalendar();
            showToast(
                "Backup Imported",
                "Data restored successfully.",
                "success"
            );
        }
        catch{
            showToast(
                "Import Failed",
                "Invalid backup file.",
                "error"
            );
        }
    };
    reader.readAsText(file);
}

function resetAllData(){
    const confirmReset = confirm(
        "Are you sure?\n\nThis will permanently delete all your data."
    );
    if(!confirmReset) return;
    localStorage.clear();
    transactions = [];
    monthlyBudget = 0;
    savingsGoal = 0;
    profileName = "User";
    currency = "₹";
    updateProfile();
    updateCurrency();
    updateOverviewCards();
    updateBudget();
    updateGoal();
    updateReports();
    renderTransactions();
    renderAllTransactions();
    renderCalendar();
    updateChart();
    initializeAnalyticsCharts();
    showToast(
        "Data Reset",
        "All data removed successfully.",
        "warning"
    );
}

function toggleTheme(){
    theme =
        theme === "dark"
        ? "light"
        : "dark";
    saveTheme();
    applyTheme();
    showToast(
        theme === "dark"
            ? "Dark Mode"
            : "Light Mode",
        "Theme changed successfully.",
        "info"
    );
}

function applyTheme(){
    document.body.setAttribute(
        "data-theme",
        theme
    );
    const icon =
        document.getElementById("themeIcon");
    if(icon){
        icon.setAttribute(
            "data-lucide",
            theme === "dark"
                ? "sun"
                : "moon"
        );
        lucide.createIcons();
    }
}

function updateInvestmentSummary(){
    let invested = 0;
    let current = 0;
    investments.forEach(item=>{
        invested += Number(item.amount);
        current += Number(item.currentValue);
    });

    const profit =
        current - invested;

    const totalInvestment =
        investments.length;

    const investedEl =
        document.getElementById(
            "totalInvested"
        );

    const currentEl =
        document.getElementById(
            "currentInvestmentValue"
        );

    const profitEl =
        document.getElementById(
            "investmentProfit"
        );

    const countEl =
        document.getElementById(
            "investmentCount"
        );

    if(investedEl){
        investedEl.textContent =
            formatCurrency(invested);
    }

    if(currentEl){
        currentEl.textContent =
            formatCurrency(current);
    }

    if(profitEl){
        profitEl.textContent =
            formatCurrency(profit);
        profitEl.className =
            profit >= 0
            ? "income"
            : "expense";
    }

    if(countEl){
        countEl.textContent =
            totalInvestment;
    }
}

function updateInvestmentInsights(){
    if(investments.length===0){
        document.getElementById("portfolioROI").textContent="0%";
        document.getElementById("portfolioGrowth").textContent="₹0";
        document.getElementById("bestInvestment").textContent="--";
        document.getElementById("worstInvestment").textContent="--";
        return;
    }

    let invested=0;
    let current=0;
    let best=investments[0];
    let worst=investments[0];
    investments.forEach(item=>{
        invested+=item.amount;
        current+=item.currentValue;
        const roi=
            (item.currentValue-item.amount)/item.amount;
        const bestROI=
            (best.currentValue-best.amount)/best.amount;
        const worstROI=
            (worst.currentValue-worst.amount)/worst.amount;
        if(roi>bestROI){
            best=item;
        }
        if(roi<worstROI){
            worst=item;
        }
    });

    const growth=current-invested;
    const roi=((growth/invested)*100)||0;
    document.getElementById("portfolioROI").textContent=
        roi.toFixed(2)+"%";
    document.getElementById("portfolioGrowth").textContent=
        formatCurrency(growth);
    document.getElementById("bestInvestment").textContent=
        best.name;
    document.getElementById("worstInvestment").textContent=
        worst.name;
}

function updateFinancialHealth(){
    let income = 0;
    let expense = 0;
    transactions.forEach(item=>{
        if(item.type==="income"){
            income += item.amount;
        }else{
            expense += item.amount;
        }
    });

    const savings =
        Math.max(
            income-expense,
            0
        );

    let invested = 0;
    let currentInvestment = 0;
    investments.forEach(item=>{
        invested += Number(item.amount);
        currentInvestment += Number(item.currentValue);

    });

    let remainingLoan = 0;
    loans.forEach(item=>{
        remainingLoan += Math.max(
            item.amount -
            (item.paidEmi * item.emi),
            0
        );
    });

    /* ---------- Individual Scores ---------- */

    const incomeScore =
        income > 0
        ? 100
        : 0;

    const savingScore =
        income > 0
        ? Math.min(
            (savings/income)*100,
            100
        )
        : 0;

    const budgetScore =
        monthlyBudget > 0
        ? Math.max(
            100 -
            (
                (expense/monthlyBudget)*100
            ),
            0
        )
        : 0;

    const investmentScore =
        invested > 0
        ? Math.min(
            (
                currentInvestment/
                invested
            )*100,
            100
        )
        : 0;

    const loanScore =
        remainingLoan===0
        ? 100
        : Math.max(
            100 -
            (
                remainingLoan/
                Math.max(income,1)
            )*10,
            0
        );

    const finalScore =
        Math.round(
            (
                incomeScore+
                savingScore+
                budgetScore+
                investmentScore+
                loanScore
            )/5
        );
    document.getElementById(
        "healthScore"
    ).textContent =
        finalScore;
    document.getElementById(
        "incomeHealth"
    ).textContent =
        Math.round(incomeScore)+"%";
    document.getElementById(
        "budgetHealth"
    ).textContent =
        Math.round(budgetScore)+"%";
    document.getElementById(
        "savingHealth"
    ).textContent =
        Math.round(savingScore)+"%";
    document.getElementById(
        "investmentHealth"
    ).textContent =
        Math.round(investmentScore)+"%";
    document.getElementById(
        "loanHealth"
    ).textContent =
        Math.round(loanScore)+"%";

    function setHealthBar(id, value){
        const bar =
            document.getElementById(id);
        if(!bar) return;
        bar.style.width = value + "%";
        if(value >= 80){
            bar.style.background = "#22C55E";
        }
        else if(value >= 60){
            bar.style.background = "#F59E0B";
        }
        else{
            bar.style.background = "#EF4444";
        }
    }

    setHealthBar("incomeHealthBar", incomeScore);
    setHealthBar("budgetHealthBar", budgetScore);
    setHealthBar("savingHealthBar", savingScore);
    setHealthBar("investmentHealthBar", investmentScore);
    setHealthBar("loanHealthBar", loanScore);

    const progress =
        document.getElementById(
            "healthProgress"
        );
    if(progress){
        const circumference = 314;
        const offset =
            circumference -
            (finalScore / 100) *
            circumference;
        progress.style.strokeDashoffset =
            offset;
    }

    const status =
        document.getElementById(
            "healthStatus"
        );

    if(status){

        if(finalScore >= 85){

            status.textContent =
                "Excellent";

            status.style.background =
                "rgba(34,197,94,.15)";

            status.style.color =
                "#22C55E";

        }

        else if(finalScore >= 70){

            status.textContent =
                "Good";

            status.style.background =
                "rgba(59,130,246,.15)";

            status.style.color =
                "#3B82F6";

        }

        else if(finalScore >= 50){

            status.textContent =
                "Average";

            status.style.background =
                "rgba(245,158,11,.15)";

            status.style.color =
                "#F59E0B";

        }

        else{

            status.textContent =
                "Poor";

            status.style.background =
                "rgba(239,68,68,.15)";

            status.style.color =
                "#EF4444";

        }

    }

    const insight =
        document.getElementById(
            "healthInsight"
        );

    if(insight){

        const tips = [];

        if(budgetScore < 70){

            tips.push(
                "⚠ Reduce monthly expenses to improve your budget score."
            );

        }

        if(savingScore >= 80){

            tips.push(
                "✅ Excellent savings habit. Keep it up!"
            );

        }

        if(investmentScore >= 90){

            tips.push(
                "📈 Your investments are performing well."
            );

        }

        if(loanScore < 70){

            tips.push(
                "🏦 Paying more EMIs can improve your financial health."
            );

        }

        if(finalScore >= 85){

            tips.push(
                "🎯 Your overall financial health is excellent."
            );

        }

        if(tips.length===0){

            tips.push(
                "💡 Keep tracking your finances regularly."
            );

        }

        insight.innerHTML =

        `
            <h4>
                Smart Insights
            </h4>

            <ul>

                ${
                    tips.map(item=>

                        `<li>${item}</li>`

                    ).join("")
                }

            </ul>

        `;

    }
}





const achievements = [

    // Transactions
    {
        id:"first_transaction",
        title:"First Transaction",
        description:"Add your first transaction.",
        icon:"🎉",
        unlocked:false,
    },

    {
        id:"ten_transactions",
        title:"10 Transactions",
        description:"Complete 10 transactions.",
        icon:"📊",
        unlocked:false,
    },

    {
        id:"fifty_transactions",
        title:"50 Transactions",
        description:"Complete 50 transactions.",
        icon:"🚀",
        unlocked:false,
    },

    {
        id:"hundred_transactions",
        title:"100 Transactions",
        description:"Complete 100 transactions.",
        icon:"👑",
        unlocked:false,
    },

    // Income

    {
        id:"first_income",
        title:"First Income",
        description:"Record your first income.",
        icon:"💰",
        unlocked:false,
    },

    {
        id:"income_10000",
        title:"₹10K Income",
        description:"Earn ₹10,000 income.",
        icon:"💵",
        unlocked:false,
    },

    {
        id:"income_50000",
        title:"₹50K Income",
        description:"Earn ₹50,000 income.",
        icon:"💸",
        unlocked:false,
    },

    {
        id:"income_100000",
        title:"₹1L Income",
        description:"Earn ₹1,00,000 income.",
        icon:"🏦",
        unlocked:false,
    },

    // Expense

    {
        id:"first_expense",
        title:"First Expense",
        description:"Record your first expense.",
        icon:"💳",
        unlocked:false,
    },

    {
        id:"expense_10000",
        title:"Spend ₹10K",
        description:"Spend ₹10,000.",
        icon:"🛒",
        unlocked:false,
    },

    {
        id:"expense_50000",
        title:"Spend ₹50K",
        description:"Spend ₹50,000.",
        icon:"💸",
        unlocked:false,
    },

    // Investment

    {
        id:"first_investment",
        title:"First Investment",
        description:"Add your first investment.",
        icon:"📈",
        unlocked:false,
    },

    {
        id:"five_investments",
        title:"Investor",
        description:"Own 5 investments.",
        icon:"📊",
        unlocked:false,
    },

    // Loan

    {
        id:"first_loan",
        title:"First Loan",
        description:"Add your first loan.",
        icon:"🏦",
        unlocked:false,
    },

    // Budget

    {
        id:"budget_master",
        title:"Budget Master",
        description:"Stay within budget.",
        icon:"🎯",
        unlocked:false,
    },

    // Goal

    {
        id:"first_goal",
        title:"First Goal",
        description:"Create your first savings goal.",
        icon:"⭐",
        unlocked:false,
    },

    {
        id:"goal_completed",
        title:"Goal Completed",
        description:"Achieve your savings goal.",
        icon:"🏆",
        unlocked:false,
    },

    // Savings

    {
        id:"save_50000",
        title:"₹50K Savings",
        description:"Save ₹50,000.",
        icon:"💎",
        unlocked:false,
    },

    // Premium

    {
        id:"finance_pro",
        title:"Finance Pro",
        description:"Unlock every achievement.",
        icon:"👑",
        unlocked:false,
    }

];

function renderAchievements() {

    const container =
        document.getElementById("achievementList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const unlocked =
        achievements.filter(
            item => item.unlocked
        ).length;

    const percent =
        Math.round(
            (unlocked / achievements.length) * 100
        );

    document.getElementById(
        "achievementUnlocked"
    ).textContent = unlocked;

    document.getElementById(
        "achievementTotal"
    ).textContent = achievements.length;

    document.getElementById(
        "achievementPercent"
    ).textContent = percent + "%";

    document.getElementById(
        "achievementProgress"
    ).style.width = percent + "%";

    achievements.slice(0,4).forEach(item => {

        container.innerHTML += `
            <div class="achievement-item">

                <div class="achievement-icon">
                    ${item.icon}
                </div>

                <div class="achievement-content">

                    <div class="achievement-top">

                        <h4>${item.title}</h4>

                        <span class="achievement-status ${
                            item.unlocked
                                ? "unlocked"
                                : "locked"
                        }">

                            ${
                                item.unlocked
                                    ? "Unlocked"
                                    : "Locked"
                            }

                        </span>

                    </div>

                    <p>${item.description}</p>

                </div>

            </div>
        `;

    });
    renderAllAchievements();

}

function updateAchievements() {

    const totalTransactions =
        transactions.length;

    const incomeCount =
        transactions.filter(
            item => item.type === "income"
        ).length;

    const expenseCount =
        transactions.filter(
            item => item.type === "expense"
        ).length;

    const totalIncome =
        transactions
            .filter(item => item.type === "income")
            .reduce((sum,item)=>sum+item.amount,0);

    const totalExpense =
        transactions
            .filter(item => item.type === "expense")
            .reduce((sum,item)=>sum+item.amount,0);

    const totalSavings =
        Math.max(
            totalIncome - totalExpense,
            0
        );

    achievements.forEach(item => {

        switch(item.id){

            case "first_transaction":
                item.unlocked = totalTransactions >= 1;
                break;

            case "ten_transactions":
                item.unlocked = totalTransactions >= 10;
                break;

            case "fifty_transactions":
                item.unlocked = totalTransactions >= 50;
                break;

            case "hundred_transactions":
                item.unlocked = totalTransactions >= 100;
                break;

            case "first_income":
                item.unlocked = incomeCount >= 1;
                break;

            case "income_10000":
                item.unlocked = totalIncome >= 10000;
                break;

            case "income_50000":
                item.unlocked = totalIncome >= 50000;
                break;

            case "income_100000":
                item.unlocked = totalIncome >= 100000;
                break;

            case "first_expense":
                item.unlocked = expenseCount >= 1;
                break;

            case "expense_10000":
                item.unlocked = totalExpense >= 10000;
                break;

            case "expense_50000":
                item.unlocked = totalExpense >= 50000;
                break;

            case "first_investment":

                item.unlocked =
                    Array.isArray(investments) &&
                    investments.length >= 1;

                break;

            case "five_investments":

                item.unlocked =
                    Array.isArray(investments) &&
                    investments.length >= 5;

                break;

            case "first_loan":

                item.unlocked =
                    Array.isArray(loans) &&
                    loans.length >= 1;

                break;

            case "budget_master":
                item.unlocked =
                    monthlyBudget > 0 &&
                    totalExpense <= monthlyBudget;
                break;

            case "first_goal":

                item.unlocked =
                    Number(savingsGoal) > 0;

                break;

            case "goal_completed":

                item.unlocked =
                    Number(savingsGoal) > 0 &&
                    totalSavings >= Number(savingsGoal);

                break;

            case "save_50000":

                item.unlocked =
                    totalSavings >= 50000;

                break;

            case "finance_pro":

                item.unlocked =
                    achievements
                        .filter(a => a.id !== "finance_pro")
                        .every(a => a.unlocked);

                break;
        }

        const storageKey =
            `achievement_${item.id}`;

        const alreadyShown =
            localStorage.getItem(storageKey);

        if(
            item.unlocked &&
            !alreadyShown
        ){

            showToast(
                "Achievement Unlocked",
                `${item.icon} ${item.title}`,
                "achievement"
            );

            localStorage.setItem(
                storageKey,
                "true"
            );

        }

    });

    const unlocked =
        achievements.filter(
            item => item.unlocked
        ).length;

    const percent =
        Math.round(
            (unlocked / achievements.length) * 100
        );

    // ===========================
    // Sidebar Achievement Count
    // ===========================

    const sidebarAchievement =
        document.getElementById(
            "sidebarAchievementCount"
        );

    if (sidebarAchievement) {
        sidebarAchievement.textContent =
            `${unlocked} / ${achievements.length}`;
    }

    document.getElementById(
        "achievementUnlocked"
    ).textContent = unlocked;

    document.getElementById(
        "achievementPercent"
    ).textContent =
        percent + "%";

    document.getElementById(
        "achievementProgress"
    ).style.width =
        percent + "%";

    renderAchievements();
}

function renderAllAchievements(){

    const container =
        document.getElementById(
            "allAchievements"
        );

    if(!container){
        return;
    }

    container.innerHTML = "";

    achievements.forEach(item=>{

        container.innerHTML += `

        <div class="achievement-item ${item.unlocked ? "achievement-unlocked" : ""}">

            <div class="achievement-icon">
                ${item.icon}
            </div>

            <div class="achievement-content">

                <h4>${item.title}</h4>

                <p>${item.description}</p>

                <small>
                    ${item.unlocked
                        ? "🎉 Achievement Unlocked"
                        : "🔒 Complete the task to unlock"}
                </small>

            </div>

            <span class="achievement-status ${
                item.unlocked
                    ? "unlocked"
                    : "locked"
            }">

                ${
                    item.unlocked
                        ? "Unlocked"
                        : "Locked"
                }

            </span>

        </div>

        `;

    });

}

// ===========================
// Toast Notification
// ===========================

function showToast(
    title,
    message,
    type = "info"
){

    const container =
        document.getElementById(
            "toastContainer"
        );

    if(!container) return;

    const icons = {

        success:"✅",

        error:"❌",

        warning:"⚠️",

        info:"ℹ️",

        achievement:"🏆"

    };

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.innerHTML =

    `
        <div class="toast-icon">

            ${icons[type] || "ℹ️"}

        </div>

        <div class="toast-content">

            <div class="toast-title">

                ${title}

            </div>

            <div class="toast-message">

                ${message}

            </div>

        </div>
    `;

    container.appendChild(
        toast
    );

    requestAnimationFrame(()=>{

        toast.classList.add(
            "show"
        );

    });

    setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

        toast.classList.add(
            "hide"
        );

        setTimeout(()=>{

            toast.remove();

        },450);

    },3000);

}