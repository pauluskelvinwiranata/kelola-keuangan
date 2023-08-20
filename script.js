const transactionType = document.getElementById("transactionType");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const addTransactionButton = document.getElementById("addTransactionButton");
const transactionList = document.getElementById("transactionList");
const balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let totalBalance = calculateTotalBalance(transactions);

renderTransactions();
updateBalanceDisplay();

addTransactionButton.addEventListener("click", function () {
  const type = transactionType.value;
  const transactionAmount = parseFloat(amount.value);
  const transactionDate = date.value;

  if (!isNaN(transactionAmount) && transactionDate !== "") {
    const transaction = {
      type,
      amount: transactionAmount,
      date: transactionDate,
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (type === "income") {
      totalBalance += transactionAmount;
    } else {
      totalBalance -= transactionAmount;
    }

    renderTransactions();
    updateBalanceDisplay();
    amount.value = "";
    date.value = "";
  }
});

transactionList.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("delete-button")) {
    const index = event.target.getAttribute("data-index");
    const deletedTransaction = transactions.splice(index, 1)[0];
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (deletedTransaction.type === "income") {
      totalBalance -= deletedTransaction.amount;
    } else {
      totalBalance += deletedTransaction.amount;
    }

    renderTransactions();
    updateBalanceDisplay();
  }
});

function calculateTotalBalance(transactions) {
  return transactions.reduce((total, transaction) => {
    return transaction.type === "income"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const transactionItem = document.createElement("li");
    const formattedAmount = formatCurrency(transaction.amount);
    transactionItem.innerHTML = `${
      transaction.type === "income" ? "Pendapatan " : "Pengeluaran "
    }: ${formattedAmount} (${
      transaction.date
    }) <button class="delete-button" data-index="${index}">Hapus</button>`;
    transactionList.appendChild(transactionItem);
  });
}

function updateBalanceDisplay() {
  const formattedBalance = formatCurrency(totalBalance);
  balance.textContent = `Saldo : ${formattedBalance}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}
