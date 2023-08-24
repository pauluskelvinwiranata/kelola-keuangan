const transactionType = document.getElementById("transactionType"),
  amount = document.getElementById("amount"),
  date = document.getElementById("date"),
  addTransactionButton = document.getElementById("addTransactionButton"),
  transactionList = document.getElementById("transactionList"),
  balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [],
  totalBalance = calculateTotalBalance(transactions);

function calculateTotalBalance(transactions) {
  return transactions.reduce(
    (total, transaction) =>
      transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount,
    0
  );
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const listItem = document.createElement("li");
    const formattedAmount = formatCurrency(transaction.amount);
    listItem.innerHTML = `
      ${
        transaction.type === "income" ? "Pendapatan" : "Pengeluaran"
      }: ${formattedAmount} (${transaction.date})
      <button class="delete-button" data-index="${index}">Hapus</button>`;
    transactionList.appendChild(listItem);
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

renderTransactions();
updateBalanceDisplay();

addTransactionButton.addEventListener("click", function () {
  const selectedType = transactionType.value;
  const enteredAmount = parseFloat(amount.value);
  const enteredDate = date.value;

  if (!isNaN(enteredAmount) && enteredDate !== "") {
    const newTransaction = {
      type: selectedType,
      amount: enteredAmount,
      date: enteredDate,
    };
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (selectedType === "income") {
      totalBalance += enteredAmount;
    } else {
      totalBalance -= enteredAmount;
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
    const removedTransaction = transactions.splice(index, 1)[0];
    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (removedTransaction.type === "income") {
      totalBalance -= removedTransaction.amount;
    } else {
      totalBalance += removedTransaction.amount;
    }

    renderTransactions();
    updateBalanceDisplay();
  }
});
