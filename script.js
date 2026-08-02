"use strict";

lucide.createIcons();
let editingRecurringId = null;
let editLoanId = null;
let editingInvestment = null;
let currentDate = new Date();
loadTransactions();
checkRecurringTransactions();
updateBudget();
updateOverviewCards();
renderTransactions();
renderAllTransactions();
renderRecurringTransactions();
renderUpcomingBills();
updateNotificationCount();
renderNotifications();
initializeChart();
initializeAnalyticsCharts();
updateGoal();
updateReports();
renderMonthlyInsights();
renderCalendar();
updateProfile();
updateCurrency();
applyTheme();

const form = document.getElementById("transactionForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const transaction = {
        id: Date.now(),
        title:
            document.getElementById("title").value,
        amount:
            Number(
                document.getElementById("amount").value
            ),
        category:
            document.getElementById("category").value,
        type:
            document.getElementById("type").value,
        date:
            new Date().toISOString().split("T")[0]
    };

    const isRecurring =
        document.getElementById(
            "isRecurring"
        ).checked;

    const repeatType =
        document.getElementById(
            "repeatType"
        ).value;

    if (editTransactionId !== null) {
        const index = transactions.findIndex(
            item => item.id === editTransactionId
        );
        transactions[index] = {
            ...transaction,
            id: editTransactionId
        };
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

        editTransactionId = null;

        showToast(
            "Transaction Updated",
            "Transaction updated successfully.",
            "success"
        );
    }else{
        addTransaction(transaction);
    }

    if(isRecurring){
        if(editingRecurringId !== null){
            const index =
                recurringTransactions.findIndex(
                    item => item.id === editingRecurringId
                );
            recurringTransactions[index] = {
                ...recurringTransactions[index],
                title:transaction.title,
                amount:transaction.amount,
                category:transaction.category,
                type:transaction.type,
                repeat:repeatType
            };
            editingRecurringId = null;
        }else{
            recurringTransactions.push({
                ...transaction,
                repeat:repeatType,
                nextDate:transaction.date,
                active:true
            });
        }
        saveRecurringTransactions();
        renderUpcomingBills();
        updateNotificationCount();
        renderNotifications();
        renderRecurringTransactions();
    }
    form.reset();
    closeModal();
});

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

searchInput.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);

const navItems = document.querySelectorAll(".sidebar-nav li");
const pages = document.querySelectorAll(".page");

const allSearchInput = document.getElementById("allSearchInput");
const allFilterType = document.getElementById("allFilterType");
const sortTransactions = document.getElementById("sortTransactions");

if (allSearchInput) {
    allSearchInput.addEventListener("input", renderAllTransactions);
}

if (allFilterType) {
    allFilterType.addEventListener("change", renderAllTransactions);
}

if (sortTransactions) {
    sortTransactions.addEventListener(
        "change",
        renderAllTransactions
    );
}

navItems.forEach(item => {
    item.addEventListener("click", function () {
        navItems.forEach(nav => {
            nav.classList.remove("active");
        });
        this.classList.add("active");
        const pageId = this.dataset.page;
        pages.forEach(page => {
            page.classList.remove("active-page");
        });
        document
            .getElementById(pageId)
            .classList.add("active-page");
    });
});

const saveBudgetBtn =
    document.getElementById("saveBudgetBtn");

if (saveBudgetBtn) {
    saveBudgetBtn.addEventListener("click", () => {
        const input =
            document.getElementById("budgetAmount");
        const amount =
            Number(input.value);
        if (amount <= 0) {

            showToast(
                "Invalid Budget",
                "Please enter a valid budget amount.",
                "warning"
            );

            return;
        }
        monthlyBudget = amount;
        saveBudget();
        updateBudget();
        input.value = "";

        showToast(
            "Budget Updated",
            "Monthly budget saved.",
            "success"
        );
    });
}

const saveGoalBtn =
    document.getElementById("saveGoalBtn");

if (saveGoalBtn) {
    saveGoalBtn.addEventListener("click", () => {
        const input =
            document.getElementById("goalAmount");
        const amount =
            Number(input.value);
        if (amount <= 0) {

            showToast(
                "Invalid Goal",
                "Please enter a valid savings goal.",
                "warning"
            );

            return;
        }
        savingsGoal = amount;
        saveGoal();
        updateGoal();
        input.value = "";

        showToast(
            "Goal Updated",
            "Savings goal updated.",
            "success"
        );
    });
}

const exportCSVBtn =
    document.getElementById("exportCSVBtn");

if(exportCSVBtn){
    exportCSVBtn.addEventListener("click",exportCSV);
}

const exportPDFBtn =
    document.getElementById("exportPDFBtn");

if(exportPDFBtn){
    exportPDFBtn.addEventListener(
        "click",
        exportPDF
    );
}

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

if(prevMonth){
    prevMonth.addEventListener("click",()=>{
        currentDate.setMonth(
            currentDate.getMonth()-1
        );
        renderCalendar();
    });
}

if(nextMonth){
    nextMonth.addEventListener("click",()=>{
        currentDate.setMonth(
            currentDate.getMonth()+1
        );
        renderCalendar();
    });
}

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

if(saveProfileBtn){
    saveProfileBtn.addEventListener("click",()=>{
        const input =
            document.getElementById("profileName");
        profileName =
            input.value.trim() || "Shivpal";
        saveProfile();
        updateProfile();

        showToast(
            "Profile Updated",
            "Profile saved successfully.",
            "success"
        );
    });
}

const currencySelect =
    document.getElementById(
        "currencySelect"
    );

if(currencySelect){
    currencySelect.addEventListener(
        "change",
        ()=>{
            currency =
                currencySelect.value;
            saveCurrency();
            updateOverviewCards();
            renderTransactions();
            renderAllTransactions();
            initializeAnalyticsCharts();
            updateBudget();
            updateGoal();
            updateReports();
            renderCalendar();

            showToast(
                "Currency Updated",
                "Currency changed successfully.",
                "info"
            );
        }
    );
}

const exportBtn =
    document.getElementById("exportBackupBtn");

if(exportBtn){
    exportBtn.addEventListener(
        "click",
        exportBackup
    );
}

const importBtn =
    document.getElementById("importBackupBtn");

const importFile =
    document.getElementById("importBackupFile");

if(importBtn){
    importBtn.addEventListener("click",()=>{
        importFile.click();
    });
}

if(importFile){
    importFile.addEventListener("change",(e)=>{
        if(e.target.files.length){
            importBackup(
                e.target.files[0]
            );
        }
    });
}

const resetBtn =
    document.getElementById("resetDataBtn");

if(resetBtn){
    resetBtn.addEventListener(
        "click",
        resetAllData
    );
}

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

if(themeToggle){
    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}

const recurringCheck =
    document.getElementById(
        "isRecurring"
    );

const repeatGroup =
    document.getElementById(
        "repeatGroup"
    );

if(recurringCheck){
    recurringCheck.addEventListener(
        "change",
        ()=>{
            repeatGroup.style.display =
                recurringCheck.checked
                ? "block"
                : "none";
        }
    );
}

const viewAllBtn =
    document.querySelector(
        ".transaction-card .view-all-btn"
    );

if(viewAllBtn){
    viewAllBtn.addEventListener("click",()=>{
        navItems.forEach(item=>{
            item.classList.remove("active");
        });
        document
            .querySelector(
                '[data-page="transactions-page"]'
            )
            .classList.add("active");
        pages.forEach(page=>{
            page.classList.remove("active-page");
        });
        document
            .getElementById(
                "transactions-page"
            )
            .classList.add("active-page");
    });
}

const viewReportBtn =
    document.querySelector(
        ".chart-card .view-all-btn"
    );

if(viewReportBtn){
    viewReportBtn.addEventListener("click",()=>{
        navItems.forEach(item=>{
            item.classList.remove("active");
        });
        document
            .querySelector(
                '[data-page="reports-page"]'
            )
            .classList.add("active");
        pages.forEach(page=>{
            page.classList.remove("active-page");
        });
        document
            .getElementById(
                "reports-page"
            )
            .classList.add("active-page");
    });
}

const viewUpcomingBtn =
    document.getElementById(
        "viewUpcomingBtn"
    );

if(viewUpcomingBtn){
    viewUpcomingBtn.addEventListener(
        "click",
        ()=>{
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
    );
}

const viewAchievementBtn =
    document.getElementById(
        "viewAchievementBtn"
    );

if(viewAchievementBtn){
    viewAchievementBtn.addEventListener(
        "click",
        ()=>{

            navItems.forEach(item=>{
                item.classList.remove(
                    "active"
                );
            });

            document
                .querySelector(
                    '[data-page="achievements-page"]'
                )
                ?.classList.add(
                    "active"
                );

            pages.forEach(page=>{
                page.classList.remove(
                    "active-page"
                );
            });

            document
                .getElementById(
                    "achievements-page"
                )
                ?.classList.add(
                    "active-page"
                );

        }
    );
}

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

const notificationPanel =
    document.getElementById(
        "notificationPanel"
    );

if(notificationBtn){
    notificationBtn.addEventListener(
        "click",
        ()=>{
            notificationPanel.classList.toggle(
                "show"
            );
        }
    );
}

document.addEventListener(
    "click",
    (e)=>{
        if(
            !notificationPanel ||
            !notificationBtn
        ){
            return;
        }
        const clickedInsidePanel =
            notificationPanel.contains(
                e.target
            );
        const clickedBell =
            notificationBtn.contains(
                e.target
            );
        if(
            !clickedInsidePanel &&
            !clickedBell
        ){
            notificationPanel.classList.remove(
                "show"
            );
        }
    }
);

const notificationViewAllBtn =
    document.getElementById(
        "notificationViewAllBtn"
    );

if(notificationViewAllBtn){
    notificationViewAllBtn.addEventListener(
        "click",
        ()=>{
            notificationPanel.classList.remove(
                "show"
            );
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
    );
}

const globalSearch =
    document.getElementById(
        "globalSearch"
    );

if(globalSearch){
    globalSearch.addEventListener(
        "input",
        ()=>{
            renderGlobalSearch(
                globalSearch.value
            );
        }
    );
}

let selectedSearchIndex = -1;

document.addEventListener(
    "keydown",
    (e)=>{
        const results =
            document.querySelectorAll(
                ".global-search-item"
            );
        if(results.length===0){
            return;
        }
        if(e.key==="ArrowDown"){
            e.preventDefault();
            selectedSearchIndex++;
            if(
                selectedSearchIndex>=results.length
            ){
                selectedSearchIndex=0;
            }
        }
        else if(e.key==="ArrowUp"){
            e.preventDefault();
            selectedSearchIndex--;
            if(selectedSearchIndex<0){
                selectedSearchIndex=
                    results.length-1;
            }
        }
        else if(e.key==="Enter"){
            if(selectedSearchIndex>=0){
                results[
                    selectedSearchIndex
                ].click();
            }
        }
        else if(e.key==="Escape"){
            document
                .getElementById(
                    "globalSearchResults"
                )
                ?.classList.remove(
                    "show"
                );
            selectedSearchIndex=-1;
            return;
        }
        results.forEach(item=>
            item.classList.remove(
                "active"
            )
        );

        if(selectedSearchIndex>=0){
            results[
                selectedSearchIndex
            ].classList.add(
                "active"
            );
            results[
                selectedSearchIndex
            ].scrollIntoView({
                block:"nearest"
            });
        }
    }
);

const addLoanBtn =
    document.getElementById(
        "addLoanBtn"
    );

const loanModal =
    document.getElementById(
        "loanModal"
    );

const closeLoanModal =
    document.querySelector(
        ".close-loan-modal"
    );

if(addLoanBtn){
    addLoanBtn.addEventListener(
        "click",
        ()=>{
            loanModal.classList.remove(
                "hidden"
            );
        }
    );
}

if(closeLoanModal){
    closeLoanModal.addEventListener(
        "click",
        ()=>{

            loanModal.classList.add(
                "hidden"
            );

            editLoanId = null;

            loanForm.reset();

        }
    );
}

window.addEventListener(
    "click",
    (e)=>{

        if(e.target===loanModal){

            loanModal.classList.add(
                "hidden"
            );

            editLoanId = null;

            loanForm.reset();

        }

    }
);

const loanForm =
    document.getElementById(
        "loanForm"
    );

if(loanForm){
    loanForm.addEventListener(
        "submit",
        (e)=>{
            e.preventDefault();

            const isEditLoan =
            editLoanId !== null;

            const loanData = {
                id: editLoanId || Date.now(),
                name:
                document.getElementById(
                    "loanName"
                ).value,
                amount:Number(
                    document.getElementById(
                        "loanAmount"
                    ).value
                ),

                emi:Math.ceil(
                    Number(
                        document.getElementById(
                            "loanAmount"
                        ).value
                    )
                    /
                    Number(
                        document.getElementById(
                            "loanTotalEmi"
                        ).value
                    )
                ),

                totalEmi:Number(
                    document.getElementById(
                        "loanTotalEmi"
                    ).value
                ),

                paidEmi:
                    editLoanId
                    ?
                    loans.find(
                        item=>item.id===editLoanId
                    ).paidEmi
                    :
                    0,
                nextDate:
                document.getElementById(
                    "loanNextDate"
                ).value
            };

            if(editLoanId){
                loans = loans.map(item=>
                    item.id===editLoanId
                    ?
                    loanData
                    :
                    item
                );
            }else{
                loans.push(
                    loanData
                );
            }
            editLoanId = null;
            saveLoans(loans);
            renderLoans();
            updateLoanSummary();
            renderUpcomingEmi();
            updateAchievements();
            renderAllAchievements();
            updateFinancialHealth();
            loanModal.classList.add(
                "hidden"
            );
            loanForm.reset();

            showToast(
                isEditLoan
                    ? "Loan Updated"
                    : "Loan Added",
                "Loan saved successfully.",
                "success"
            );
        }
    );
}

renderLoans();
renderInvestments();
updateInvestmentSummary();
updateInvestmentInsights();
updateInvestmentChart();
updateLoanSummary();
renderUpcomingEmi();
updateAchievements();
renderAllAchievements();
updateFinancialHealth();

const investmentModal =
    document.getElementById(
        "investmentModal"
    );

const investmentForm =
    document.getElementById(
        "investmentForm"
    );

const addInvestmentBtn =
    document.getElementById(
        "addInvestmentBtn"
    );

const closeInvestmentModal =
    document.getElementById(
        "closeInvestmentModal"
    );

if(addInvestmentBtn){
    addInvestmentBtn.addEventListener(
        "click",
        ()=>{
            investmentModal.classList.remove(
                "hidden"
            );
        }
    );
}

if(closeInvestmentModal){
    closeInvestmentModal.addEventListener(
        "click",
        ()=>{

            investmentModal.classList.add(
                "hidden"
            );

            editingInvestment = null;

            investmentForm.reset();

        }
    );
}

if(investmentForm){
    investmentForm.addEventListener(
        "submit",

        function(e){
            e.preventDefault();
            const investment = {
                id:
                    editingInvestment
                    || Date.now(),
                name:
                    document.getElementById(
                        "investmentName"
                    ).value,
                type:
                    document.getElementById(
                        "investmentType"
                    ).value,
                amount:
                    Number(
                        document.getElementById(
                            "investmentAmount"
                        ).value
                    ),
                currentValue:
                    Number(
                        document.getElementById(
                            "investmentCurrentValue"
                        ).value
                    ),
                date:
                    document.getElementById(
                        "investmentDate"
                    ).value
            };

            const isEditInvestment =
            editingInvestment !== null;

            if(editingInvestment){
                investments =
                    investments.map(item=>
                        item.id===editingInvestment
                        ? investment
                        : item
                    );
                saveInvestments();
                editingInvestment = null;
                renderInvestments();
                updateInvestmentSummary();
                updateInvestmentInsights();
                updateInvestmentChart();
                updateFinancialHealth();

                updateAchievements();

                renderAllAchievements();
            }else{
                addInvestment(
                    investment
                );
            }
            investmentForm.reset();
            investmentModal.classList.add(
                "hidden"
            );

            if(isEditInvestment){

                showToast(
                    "Investment Updated",
                    "Investment updated successfully.",
                    "success"
                );

            }
        }
    );
}

const investmentSearch =
    document.getElementById(
        "investmentSearch"
    );

const investmentFilter =
    document.getElementById(
        "investmentFilter"
    );

const investmentSort =
    document.getElementById(
        "investmentSort"
    );

investmentSearch?.addEventListener(
    "input",
    renderInvestments
);

investmentFilter?.addEventListener(
    "change",
    renderInvestments
);

investmentSort?.addEventListener(
    "change",
    renderInvestments
);

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.querySelector(".sidebar-overlay");

if(menuToggle){

    menuToggle.onclick = ()=>{

        sidebar.classList.add("show");

        overlay.classList.add("show");

    };

}

overlay.onclick = ()=>{

    sidebar.classList.remove("show");

    overlay.classList.remove("show");

};