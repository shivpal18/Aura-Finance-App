let editTransactionId = null;

function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
        case "food":
            return "🍔";
        case "shopping":
            return "🛍️";
        case "entertainment":
            return "🎬";
        case "transport":
            return "🚗";
        case "salary":
            return "💰";
        case "bills":
            return "📄";
        default:
            return "📦";
    }
}

function renderTransactions() {
    const transactionList = document.getElementById("transactionList");
    if (!transactionList) return;
    transactionList.innerHTML = "";

    const searchText = document
        .getElementById("searchInput")
        ?.value
        .toLowerCase() || "";

    const filterType = document
        .getElementById("filterType")
        ?.value || "all";

    const filteredTransactions = [...transactions]
        .filter(transaction => {
            const matchSearch = transaction.title
                .toLowerCase()
                .includes(searchText);
            const matchFilter =
                filterType === "all" ||
                transaction.type === filterType;
            return matchSearch && matchFilter;
        })
        .reverse()
        .slice(0, 5);

    filteredTransactions.forEach(transaction => {
        const displayDate = transaction.date
            ? new Date(transaction.date).toLocaleDateString("en-IN")
            : "N/A";
        const transactionItem = document.createElement("div");
        transactionItem.className = "transaction-item";

        transactionItem.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.title}</h4>
                <p>${transaction.category} • ${displayDate}</p>
            </div>

            <div class="transaction-actions">
                <span class="${transaction.type}">
                    ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
                </span>
                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    ✏️
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    🗑️
                </button>
            </div>
        `;
        transactionList.appendChild(transactionItem);
    });
}

function renderAllTransactions() {
    const transactionList =
        document.getElementById("allTransactionList");

    if (!transactionList) return;
    transactionList.innerHTML = "";

    const searchText = document
        .getElementById("allSearchInput")
        ?.value
        .toLowerCase() || "";

    const filterType = document
        .getElementById("allFilterType")
        ?.value || "all";

    const sortType = document
        .getElementById("sortTransactions")
        ?.value || "newest";

    const filteredTransactions = [...transactions]
        .filter(transaction => {
            const matchSearch = transaction.title
                .toLowerCase()
                .includes(searchText);
            const matchFilter =
                filterType === "all" ||
                transaction.type === filterType;
            return matchSearch && matchFilter;
        })

        .sort((a, b) => {
            switch (sortType) {
                case "oldest":
                    return new Date(a.date) - new Date(b.date);
                case "high":
                    return b.amount - a.amount;
                case "low":
                    return a.amount - b.amount;
                case "az":
                    return a.title.localeCompare(b.title);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

    filteredTransactions.forEach((transaction, index) => {
        const displayDate = transaction.date
            ? new Date(transaction.date).toLocaleDateString("en-IN")
            : "N/A";

        const transactionItem = document.createElement("div");
        transactionItem.className = "transaction-row";
        transactionItem.innerHTML = `
            <div>${index + 1}</div>
            <div>${transaction.title}</div>
            <div class="category-badge">
                <span>${getCategoryIcon(transaction.category)}</span>
                <span>${transaction.category}</span>
            </div>
            <div>${displayDate}</div>

            <div class="${transaction.type}">
                ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
            </div>

            <div class="table-actions">
                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    ✏️
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    🗑️
                </button>
            </div>
        `;
        transactionList.appendChild(transactionItem);
    });

}

function addTransaction(transaction) {
    transactions.push(transaction);
    saveTransactions();
    updateOverviewCards();
    renderTransactions();
    renderAllTransactions();
    updateChart();
    initializeAnalyticsCharts();
    updateBudget();
    updateGoal();
    updateReports();
    renderCalendar();
    renderMonthlyInsights();
    updateAchievements();
    renderAllAchievements();
    updateFinancialHealth();

    showToast(
        "Transaction Added",
        "Transaction added successfully.",
        "success"
    );
}

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );
    saveTransactions();
    updateOverviewCards();
    renderTransactions();
    renderAllTransactions();
    updateChart();
    initializeAnalyticsCharts();
    updateBudget();
    updateGoal();
    updateReports();
    renderCalendar();
    renderMonthlyInsights();
    updateAchievements();
    renderAllAchievements();
    updateFinancialHealth();

    showToast(
        "Transaction Deleted",
        "Transaction deleted successfully.",
        "error"
    );
}

function editTransaction(id) {
    const transaction = transactions.find(
        item => item.id === id
    );
    if (!transaction) return;
    document.getElementById("title").value =
        transaction.title;
    document.getElementById("amount").value =
        transaction.amount;
    document.getElementById("category").value =
        transaction.category;
    document.getElementById("type").value =
        transaction.type;
    editTransactionId = id;
    openModal();
}

function checkRecurringTransactions(){
    const today =
        new Date().toISOString().split("T")[0];
    recurringTransactions.forEach(item=>{
        if(item.active === false){
            return;
        }

        if(item.nextDate<=today){
            addTransaction({
                id:Date.now()+Math.random(),
                title:item.title,
                amount:item.amount,
                category:item.category,
                type:item.type,
                date:today
            });

            const next =
                new Date(item.nextDate);
            switch(item.repeat){
                case "weekly":
                    next.setDate(
                        next.getDate()+7
                    );
                    break;
                case "yearly":
                    next.setFullYear(
                        next.getFullYear()+1
                    );
                    break;
                default:
                    next.setMonth(
                        next.getMonth()+1
                    );
            }

            item.nextDate =
                next
                .toISOString()
                .split("T")[0];
        }
    });
    saveRecurringTransactions();
}

function deleteRecurringTransaction(id){
    const confirmDelete =
        confirm(
            "Delete this recurring transaction?"
        );
    if(!confirmDelete){
        return;
    }
    recurringTransactions =
        recurringTransactions.filter(
            item => item.id !== id
        );
    saveRecurringTransactions();
    renderRecurringTransactions();

    showToast(
        "Recurring Deleted",
        "Recurring transaction removed.",
        "warning"
    );
}

function editRecurringTransaction(id){
    const item =
        recurringTransactions.find(
            transaction => transaction.id === id
        );
    if(!item){
        return;
    }
    document.getElementById("title").value =
        item.title;
    document.getElementById("amount").value =
        item.amount;
    document.getElementById("category").value =
        item.category;
    document.getElementById("type").value =
        item.type;
    document.getElementById("isRecurring").checked =
        true;
    document.getElementById("repeatGroup").style.display =
        "block";
    document.getElementById("repeatType").value =
        item.repeat;
    editingRecurringId = id;
    openModal();
}

function toggleRecurringStatus(id){
    const item =
        recurringTransactions.find(
            transaction => transaction.id === id
        );
    if(!item){
        return;
    }
    item.active = !item.active;
    saveRecurringTransactions();
    renderRecurringTransactions();

    showToast(
        item.active
            ? "Recurring Resumed"
            : "Recurring Paused",
        "Status updated successfully.",
        "info"
    );
}

function skipRecurringTransaction(id){
    const item =
        recurringTransactions.find(
            transaction => transaction.id === id
        );
    if(!item){
        return;
    }
    const next =
        new Date(item.nextDate);
    switch(item.repeat){
        case "weekly":
            next.setDate(
                next.getDate()+7
            );
            break;
        case "yearly":
            next.setFullYear(
                next.getFullYear()+1
            );
            break;
        default:
            next.setMonth(
                next.getMonth()+1
            );
    }

    item.nextDate =
        next.toISOString().split("T")[0];
    saveRecurringTransactions();
    renderRecurringTransactions();

    showToast(
        "Recurring Skipped",
        "Next payment date updated.",
        "info"
    );
}

function renderRecurringTransactions(){
    const list =
        document.getElementById(
            "recurringList"
        );
    if(!list) return;
    list.innerHTML = "";
    recurringTransactions.forEach(item=>{
        list.innerHTML += `
        <div class="recurring-card">
            <div class="recurring-header">
                <div>
                    <div class="recurring-title">
                        ${item.title}
                    </div>
                    <div class="recurring-info">
                        Amount : ₹${item.amount}
                    </div>
                    <div class="recurring-info">
                        Repeat : ${item.repeat}
                    </div>
                    <div class="recurring-info">
                        Next : ${item.nextDate}
                    </div>
                    <div class="recurring-info">
                        Status :
                        <span class="${
                            item.active !== false
                            ? "active-status"
                            : "paused-status"
                        }">
                        ${
                            item.active !== false
                            ? "🟢 Active"
                            : "🔴 Paused"
                        }
                        </span>
                    </div>
                </div>
            </div>

            <div class="recurring-actions">
                <button
                    class="pause-btn"
                    onclick="toggleRecurringStatus(${item.id})">
                    ${
                        item.active !== false
                        ? "⏸ Pause"
                        : "▶ Resume"
                    }
                </button>
                <button
                    class="edit-btn"
                    onclick="editRecurringTransaction(${item.id})">
                    ✏ Edit
                </button>
                <button
                    class="skip-btn"
                    onclick="skipRecurringTransaction(${item.id})">
                    ⏭ Skip
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteRecurringTransaction(${item.id})">
                    🗑 Delete
                </button>
            </div>
        </div>
        `;
    });
}

function renderUpcomingBills(){
    const list =
        document.getElementById(
            "upcomingList"
        );
    if(!list) return;
    const today =
        new Date();
    const upcoming =
        recurringTransactions
        .filter(item=>{
            if(item.active === false){
                return false;
            }
            const next =
                new Date(item.nextDate);
            const diff =
                Math.ceil(
                    (next - today) /
                    (1000*60*60*24)
                );
            return diff >= 0 && diff <= 7;
        })
        .sort((a,b)=>
            new Date(a.nextDate) -
            new Date(b.nextDate)
        )
        .slice(0,5);

    if(upcoming.length===0){
        list.innerHTML = `
        <p class="empty-upcoming">
            No upcoming bills
        </p>
        `;
        return;
    }

    list.innerHTML = "";
    upcoming.forEach(item=>{
        const next =
            new Date(item.nextDate);
        const diff =
            Math.ceil(
                (next - today) /
                (1000*60*60*24)
            );
        let badge = "";
        if(diff === 0){
            badge = "🟠 Today";
        }else if(diff === 1){
            badge = "🟡 Tomorrow";
        }else{
            badge = `🔵 In ${diff} days`;
        }

        list.innerHTML += `
        <div class="upcoming-item">
            <div>
                <strong>${item.title}</strong>
                <p>${item.repeat}</p>
            </div>
            <span class="upcoming-badge">
                ${badge}
            </span>
        </div>
        `;
    });
}

function updateNotificationCount(){
    const badge =
        document.getElementById(
            "notificationCount"
        );
    if(!badge) return;
    const today =
        new Date();

    const count =
        recurringTransactions.filter(item=>{
            if(item.active === false){
                return false;
            }
            const next =
                new Date(item.nextDate);
            const diff =
                Math.ceil(
                    (next - today) /
                    (1000*60*60*24)
                );
            return diff >= 0 && diff <= 7;
        }).length;

    badge.textContent = count;
    badge.style.display =
        count > 0
        ? "flex"
        : "none";
}

function renderNotifications(){
    const list =
        document.getElementById(
            "notificationList"
        );
    if(!list) return;
    const today =
        new Date();
    const upcoming =
        recurringTransactions
        .filter(item=>{
            if(item.active === false){
                return false;
            }
            const next =
                new Date(item.nextDate);
            const diff =
                Math.ceil(
                    (next - today) /
                    (1000*60*60*24)
                );
            return diff >= 0 && diff <= 7;
        })
        .sort((a,b)=>
            new Date(a.nextDate) -
            new Date(b.nextDate)
        );
    if(upcoming.length===0){
        list.innerHTML =
        `<p>No notifications</p>`;
        return;
    }

    list.innerHTML = "";
    upcoming.forEach(item=>{
        const next =
            new Date(item.nextDate);
        const diff =
            Math.ceil(
                (next - today) /
                (1000*60*60*24)
            );
        let badge = "";
        if(diff===0){
            badge = "🟠 Today";
        }else if(diff===1){
            badge = "🟡 Tomorrow";
        }else{
            badge =
                `🔵 In ${diff} days`;
        }

        list.innerHTML += `
        <div
            class="notification-item"
            onclick="openRecurringFromNotification(${item.id})">
            <strong>
                ${item.title}
            </strong>
            <p>
                ${badge}
            </p>
        </div>
        `;
    });
}

function openRecurringFromNotification(id){
    const panel =
        document.getElementById(
            "notificationPanel"
        );
    if(panel){
        panel.classList.remove(
            "show"
        );
    }
    navItems.forEach(item=>{
        item.classList.remove(
            "active"
        );
    });
    document
        .querySelector(
            '[data-page="recurring-page"]'
        )
        .classList.add(
            "active"
        );
    pages.forEach(page=>{
        page.classList.remove(
            "active-page"
        );
    });
    document
        .getElementById(
            "recurring-page"
        )
        .classList.add(
            "active-page"
        );
}

function renderMonthlyInsights(){
    const container =
        document.getElementById(
            "monthlyInsights"
        );
    if(!container){
        return;
    }
    const now =
        new Date();
    const month =
        now.getMonth();
    const year =
        now.getFullYear();
    const monthlyTransactions =
        transactions.filter(item=>{
            const date =
                new Date(item.date);
            return (
                date.getMonth()===month &&
                date.getFullYear()===year
            );
        });

    const income =
        monthlyTransactions
        .filter(item=>item.type==="income")
        .reduce(
            (sum,item)=>sum+item.amount,
            0
        );

    const expense =
        monthlyTransactions
        .filter(item=>item.type==="expense")
        .reduce(
            (sum,item)=>sum+item.amount,
            0
        );

    const savings =
        income-expense;
    container.innerHTML = `
        <div class="insight-item">
            <div class="insight-icon">
                💰
            </div>
            <div class="insight-text">
                <div class="insight-title">
                    Total Income
                </div>
                <div class="insight-value">
                    ${formatCurrency(income)}
                </div>
            </div>
        </div>

        <div class="insight-item">
            <div class="insight-icon">
                💸
            </div>
            <div class="insight-text">
                <div class="insight-title">
                    Total Expense
                </div>
                <div class="insight-value">
                    ${formatCurrency(expense)}
                </div>
            </div>
        </div>

        <div class="insight-item">
            <div class="insight-icon">
                📈
            </div>
            <div class="insight-text">
                <div class="insight-title">
                    Net Savings
                </div>
                <div class="insight-value">
                    ${formatCurrency(savings)}
                </div>
            </div>
        </div>
    `;
}

function renderGlobalSearch(query){
    const results =
        document.getElementById(
            "globalSearchResults"
        );
    if(!results){
        return;
    }
    query =
        query.trim().toLowerCase();
    if(query===""){
        results.classList.remove(
            "show"
        );
        results.innerHTML="";
        return;
    }

    const transactionResults =
        transactions.filter(item=>
            item.title
                .toLowerCase()
                .includes(query)
            ||
            item.category
                .toLowerCase()
                .includes(query)
        );

    const recurringResults =
        recurringTransactions.filter(item=>
            item.title
                .toLowerCase()
                .includes(query)

            ||
            item.category
                .toLowerCase()
                .includes(query)
        );

    const loanResults =
        loans.filter(item =>
            item.name
                .toLowerCase()
                .includes(query)
        );

    const investmentResults =
        investments.filter(item =>
            item.name
                .toLowerCase()
                .includes(query)

            ||

            item.type
                .toLowerCase()
                .includes(query)
        );

    const pageResults = [

        {
            name:"Dashboard",
            page:"dashboard-page"
        },

        {
            name:"Transactions",
            page:"transactions-page"
        },

        {
            name:"Analytics",
            page:"analytics-page"
        },

        {
            name:"Budget",
            page:"budget-page"
        },

        {
            name:"Goals",
            page:"goals-page"
        },

        {
            name:"Calendar",
            page:"calendar-page"
        },

        {
            name:"Recurring",
            page:"recurring-page"
        },

        {
            name:"Reports",
            page:"reports-page"
        },

        {
            name:"Loans",
            page:"loan-page"
        },

        {
            name:"Investments",
            page:"investment-page"
        },

        {
            name:"Achievements",
            page:"achievements-page"
        },

        {
            name:"Settings",
            page:"settings-page"
        }

    ].filter(item=>

        item.name
            .toLowerCase()
            .includes(query)

    );

    results.innerHTML="";
    if(
        transactionResults.length===0 &&
        recurringResults.length===0 &&
        loanResults.length===0 &&
        investmentResults.length===0 &&
        pageResults.length===0
    ){
        results.innerHTML=`
            <div class="global-search-item">
                No Results Found
            </div>
        `;
        results.classList.add("show");
        return;
    }
    transactionResults.forEach(item=>{
        results.innerHTML += `
        <div
            class="global-search-item"
            onclick="openSearchResult('transaction',${item.id})">

            💸 <strong>${item.title}</strong>
            <br>
            ${formatCurrency(item.amount)}

        </div>
        `;
    });

    recurringResults.forEach(item=>{
        results.innerHTML += `
        <div
            class="global-search-item"
            onclick="openSearchResult('recurring',${item.id})">
            🔁 <strong>
                ${item.title}
            </strong>
            <br>
            ${item.repeat}
        </div>
        `;
    });

    loanResults.forEach(item=>{
        results.innerHTML += `
        <div
            class="global-search-item"
            onclick="openSearchResult('loan',${item.id})">

            💳 <strong>${item.name}</strong>
            <br>
            ${formatCurrency(item.amount)}

        </div>
        `;
    });

    investmentResults.forEach(item=>{

        results.innerHTML += `
        <div
            class="global-search-item"
            onclick="openSearchResult('investment',${item.id})">

            📈 <strong>${item.name}</strong>
            <br>
            ${item.type}

        </div>
        `;

    });

    pageResults.forEach(item=>{

        results.innerHTML += `
        <div
            class="global-search-item"
            onclick="openSearchResult('page','${item.page}')">

            📄 ${item.name}

        </div>
        `;

    });

    results.classList.add(
        "show"
    );
}

function openSearchResult(page,id){
    const results =
        document.getElementById(
            "globalSearchResults"
        );
    if(results){
        results.classList.remove(
            "show"
        );
    }
    const search =
        document.getElementById(
            "globalSearch"
        );
    if(search){
        search.value="";
    }
    navItems.forEach(item=>{
        item.classList.remove(
            "active"
        );
    });
    pages.forEach(item=>{
        item.classList.remove(
            "active-page"
        );
    });

    if(page==="transaction"){
        document
            .querySelector(
                '[data-page="transactions-page"]'
            )
            .classList.add(
                "active"
            );
        document
            .getElementById(
                "transactions-page"
            )
            .classList.add(
                "active-page"
            );
        setTimeout(()=>{
            const buttons =
                document.querySelectorAll(
                    "#allTransactionList .edit-btn"
                );
            buttons.forEach(btn=>{
                if(
                    btn.getAttribute("onclick")
                    .includes(id)
                ){
                    const row =
                        btn.closest(
                            ".transaction-row"
                        );
                    if(row){
                        row.classList.add(
                            "search-highlight"
                        );
                        row.scrollIntoView({
                            behavior:"smooth",
                            block:"center"
                        });
                        setTimeout(()=>{
                            row.classList.remove(
                                "search-highlight"
                            );
                        },2000);
                    }
                }
            });
        },100);
    }
    else if(page==="loan"){

        document
            .querySelector(
                '[data-page="loan-page"]'
            )
            .classList.add(
                "active"
            );

        document
            .getElementById(
                "loan-page"
            )
            .classList.add(
                "active-page"
            );

        setTimeout(()=>{

            const buttons =
                document.querySelectorAll(
                    "#loanList .edit-loan-btn"
                );

            buttons.forEach(btn=>{

                if(
                    btn
                    .getAttribute("onclick")
                    .includes(id)
                ){

                    const card =
                        btn.closest(
                            ".loan-card"
                        );

                    card.classList.add(
                        "search-highlight"
                    );

                    card.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });

                    setTimeout(()=>{

                        card.classList.remove(
                            "search-highlight"
                        );

                    },2000);

                }

            });

        },100);

    }

    else if(page==="investment"){

        document
            .querySelector(
                '[data-page="investment-page"]'
            )
            .classList.add("active");

        document
            .getElementById(
                "investment-page"
            )
            .classList.add("active-page");

        setTimeout(()=>{

            const cards =
                document.querySelectorAll(
                    ".investment-card"
                );

            cards.forEach(card=>{

                if(
                    card.innerText
                        .toLowerCase()
                        .includes(
                            investments.find(
                                item=>item.id===id
                            ).name.toLowerCase()
                        )
                ){

                    card.classList.add(
                        "search-highlight"
                    );

                    card.scrollIntoView({
                        behavior:"smooth",
                        block:"center"
                    });

                    setTimeout(()=>{

                        card.classList.remove(
                            "search-highlight"
                        );

                    },2000);

                }

            });

        },100);

    }

    else if(page==="page"){

        document
            .querySelector(
                `[data-page="${id}"]`
            )
            .classList.add("active");

        document
            .getElementById(id)
            .classList.add("active-page");

    }

    else if(page==="recurring"){
        document
            .querySelector(
                '[data-page="recurring-page"]'
            )
            .classList.add(
                "active"
            );
        document
            .getElementById(
                "recurring-page"
            )
            .classList.add(
                "active-page"
            );
    }
}

function renderLoans(){
    const loanList =
        document.getElementById(
            "loanList"
        );
    if(!loanList){
        return;
    }

    if(loans.length===0){
        loanList.innerHTML=`
            <p>
                No Loans Added
            </p>
        `;
        return;
    }

    loanList.innerHTML=
        loans.map(loan=>`
            <div class="loan-card">
                <h3>
                    💳 ${loan.name}
                </h3>
                <div class="loan-header-actions">
                    <button
                        class="edit-loan-btn"
                        onclick="editLoan(${loan.id})">
                        ✏️
                    </button>
                    <button
                        class="delete-loan-btn"
                        onclick="deleteLoan(${loan.id})">
                        🗑
                    </button>
                </div>

                <div class="loan-info">
                    <p>
                        <strong>Total Loan</strong>
                        <span>₹${loan.amount}</span>
                    </p>
                    <p>
                        <strong>EMI</strong>
                        <span>${formatCurrency(loan.emi)}</span>
                    </p>
                </div>

                <div class="loan-progress">
                    <div
                        class="loan-progress-fill"
                        style="width:${
                            (loan.paidEmi/loan.totalEmi)*100
                        }%">
                    </div>
                </div>
                <p class="loan-progress-text">
                    Paid EMI :
                    ${loan.paidEmi} / ${loan.totalEmi}
                </p>
                <p>
                    <strong>Remaining :</strong>
                    ${formatCurrency(
                        Math.max(
                            loan.amount -
                            (loan.paidEmi * loan.emi),
                            0
                        )
                    )}
                </p>
                <p>
                    <strong>Next EMI :</strong>
                    ${new Date(loan.nextDate).toLocaleDateString(
                        "en-IN",
                        {
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                        }
                    )}
                </p>

                <div class="loan-actions">
                    <button
                        class="loan-pay-btn"
                        onclick="markEmiPaid(${loan.id})"
                        ${
                            loan.paidEmi >= loan.totalEmi
                            ? "disabled"
                            : ""
                        }>
                        ${
                            loan.paidEmi >= loan.totalEmi
                            ? "🎉 Loan Completed"
                            : "✓ Mark EMI Paid"
                        }
                    </button>
                </div>
            </div>
        `).join("");
}

function updateLoanSummary(){
    let totalLoan = 0;
    let paid = 0;
    let remaining = 0;
    let active = 0;
    loans.forEach(loan=>{
        totalLoan += loan.amount;
        const paidAmount =
            loan.paidEmi * loan.emi;
        paid += paidAmount;
        remaining +=
            Math.max(
                loan.amount-paidAmount,
                0
            );
        if(
            loan.paidEmi <
            loan.totalEmi
        ){
            active++;
        }
    });

    document.getElementById(
        "totalLoanAmount"
    ).textContent =
        formatCurrency(totalLoan);
    document.getElementById(
        "paidLoanAmount"
    ).textContent =
        formatCurrency(paid);
    document.getElementById(
        "remainingLoanAmount"
    ).textContent =
        formatCurrency(remaining);
    document.getElementById(
        "activeLoanCount"
    ).textContent =
        active;
}

function renderUpcomingEmi(){
    const container =
        document.getElementById(
            "upcomingEmiContent"
        );
    if(!container){
        return;
    }
    const activeLoans = loans.filter(
        loan=>loan.paidEmi<loan.totalEmi
    );
    if(activeLoans.length===0){
        container.innerHTML=
            "No upcoming EMI";
        return;
    }
    activeLoans.sort(
        (a,b)=>
        new Date(a.nextDate)-new Date(b.nextDate)
    );
    const loan =
        activeLoans[0];
    const diffDays =
        Math.ceil(
            (
                new Date(loan.nextDate)-new Date()
            )
            /(1000*60*60*24)
        );

    container.innerHTML = `
    <div class="upcoming-emi-content">
        <div class="upcoming-emi-name">
            💳 ${loan.name}
        </div>
        <div class="upcoming-emi-amount">
            ${formatCurrency(loan.emi)}
        </div>
        <div class="upcoming-progress">
            <div
                class="upcoming-progress-fill"
                style="width:${(loan.paidEmi/loan.totalEmi)*100}%">
            </div>
        </div>
        <div class="upcoming-progress-info">
            <span>
                ✓ EMI Paid
                ${loan.paidEmi}/${loan.totalEmi}
            </span>
            <span>
                ${Math.round(
                    (loan.paidEmi/loan.totalEmi)*100
                )}%
            </span>
        </div>
        <div class="upcoming-footer">
            <span>
                📅
                ${new Date(
                    loan.nextDate
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                    }
                )}
            </span>
            <span>
                ⏳
                ${Math.max(diffDays,0)}
                Days
            </span>
        </div>
    </div>
    `;
}

function markEmiPaid(id){
    const loan =
        loans.find(
            item=>item.id===id
        );
    if(!loan){
        return;
    }
    if(
        loan.paidEmi >=
        loan.totalEmi
    ){
        return;
    }
    loan.paidEmi++;
    if(
        loan.paidEmi <
        loan.totalEmi
    ){
        const next =
            new Date(
                loan.nextDate
            );
        next.setMonth(
            next.getMonth()+1
        );
        loan.nextDate =
            next
            .toISOString()
            .split("T")[0];
    }
    saveLoans(loans);
    renderLoans();
    renderUpcomingEmi();
    updateLoanSummary();
    updateFinancialHealth();

    showToast(
        "EMI Paid",
        "EMI marked as paid.",
        "success"
    );
}

function deleteLoan(id){
    const confirmDelete = confirm(
        "Delete this loan?"
    );
    if(!confirmDelete){
        return;
    }
    loans = loans.filter(
        loan => loan.id !== id
    );
    saveLoans(loans);
    renderLoans();
    renderUpcomingEmi();
    updateLoanSummary();
    updateFinancialHealth();

    showToast(
        "Loan Deleted",
        "Loan removed successfully.",
        "error"
    );
}

function editLoan(id){
    const loan =
        loans.find(
            item=>item.id===id
        );
    if(!loan){
        return;
    }
    editLoanId = id;
    document.getElementById(
        "loanName"
    ).value = loan.name;
    document.getElementById(
        "loanAmount"
    ).value = loan.amount;
    document.getElementById(
        "loanTotalEmi"
    ).value = loan.totalEmi;
    document.getElementById(
        "loanNextDate"
    ).value = loan.nextDate;
    loanModal.classList.remove(
        "hidden"
    );
}

function addInvestment(investment){
    investments.push(investment);
    saveInvestments();
    renderInvestments();
    updateInvestmentSummary();
    updateInvestmentInsights();
    updateInvestmentChart();
    updateFinancialHealth();

    showToast(
        "Investment Added",
        "Investment added successfully.",
        "success"
    );
}

function deleteInvestment(id){
    const confirmDelete = confirm(
        "Delete this investment?"
    );
    if(!confirmDelete){
        return;
    }
    investments =
        investments.filter(
            item => item.id !== id
        );
    saveInvestments();
    renderInvestments();
    updateInvestmentSummary();
    updateInvestmentInsights();
    updateInvestmentChart();
    updateFinancialHealth();

    showToast(
        "Investment Deleted",
        "Investment removed successfully.",
        "error"
    );
}

function editInvestment(id){
    const investment =
        investments.find(
            item => item.id === id
        );
    if(!investment){
        return;
    }
    editingInvestment = id;
    document.getElementById(
        "investmentName"
    ).value = investment.name;
    document.getElementById(
        "investmentType"
    ).value = investment.type;
    document.getElementById(
        "investmentAmount"
    ).value = investment.amount;
    document.getElementById(
        "investmentCurrentValue"
    ).value = investment.currentValue;
    document.getElementById(
        "investmentDate"
    ).value = investment.date;
    investmentModal.classList.remove(
        "hidden"
    );
}

function renderInvestments() {
    const list =
        document.getElementById(
            "investmentList"
        );

    if (!list) {
        return;
    }

    if (investments.length === 0) {
        list.innerHTML = `
            <p>No Investments Added</p>
        `;
        return;
    }

    list.innerHTML = "";

    const search =
        document
            .getElementById("investmentSearch")
            ?.value
            .toLowerCase() || "";

    const filter =
        document
            .getElementById("investmentFilter")
            ?.value || "all";

    const sort =
        document
            .getElementById("investmentSort")
            ?.value || "newest";

    const filtered = [...investments]

        .filter(item => {

            const matchSearch =
                item.name
                    .toLowerCase()
                    .includes(search)

                ||

                item.type
                    .toLowerCase()
                    .includes(search);

            const matchFilter =
                filter === "all"
                ||
                item.type === filter;

            return (
                matchSearch &&
                matchFilter
            );

        })

        .sort((a, b) => {

            switch (sort) {

                case "oldest":
                    return new Date(a.date) - new Date(b.date);

                case "amount":
                    return b.amount - a.amount;

                case "profit":
                    return (
                        (b.currentValue - b.amount)
                        -
                        (a.currentValue - a.amount)
                    );

                case "roi":
                    return (
                        ((b.currentValue - b.amount) / b.amount)
                        -
                        ((a.currentValue - a.amount) / a.amount)
                    );

                case "az":
                    return a.name.localeCompare(b.name);

                default:
                    return new Date(b.date) - new Date(a.date);
            }

        });

    if (filtered.length === 0) {
        list.innerHTML = `
            <p>No Matching Investments Found</p>
        `;
        return;
    }

    filtered.forEach(item => {

        const profit =
            item.currentValue -
            item.amount;

        const profitClass =
            profit >= 0
                ? "income"
                : "expense";

        list.innerHTML += `
        <div class="investment-card">
        
            <div class="investment-header">

                <h3>
                    📈 ${item.name}
                </h3>
                <div>
                    <button
                        class="edit-btn"
                        onclick="editInvestment(${item.id})">
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteInvestment(${item.id})">
                        🗑️
                    </button>
                </div>
            </div>

            <p>
                <strong>Type :</strong>
                ${item.type}
            </p>

            <p>
                <strong>Invested :</strong>
                ${formatCurrency(item.amount)}
            </p>

            <p>
                <strong>Current :</strong>
                ${formatCurrency(item.currentValue)}
            </p>

            <p class="${profitClass}">
                <strong>P/L :</strong>
                ${formatCurrency(profit)}
            </p>

            <p>
                <strong>Date :</strong>
                ${new Date(item.date).toLocaleDateString("en-IN")}
            </p>

        </div>
        `;
    });
}