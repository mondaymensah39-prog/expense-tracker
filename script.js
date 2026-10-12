const form = document.getElementById("expense-form");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const filterSelect = document.getElementById("filter");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");

// Load saved expenses from localStorage, or start with an empty list
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function render() {
  const selected = filterSelect.value;
  const visible = selected === "All"
    ? expenses
    : expenses.filter(expense => expense.category === selected);

  list.innerHTML = "";
  let total = 0;

  visible.forEach(expense => {
    total += expense.amount;

    const li = document.createElement("li");
    li.textContent = `${expense.category}: ${expense.amount.toFixed(2)} `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      // Find this expense's position in the full list, then remove it
      const index = expenses.indexOf(expense);
      expenses.splice(index, 1);

      saveExpenses();
      render();
    });

    li.appendChild(deleteButton);
    list.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  expenses.push({
    category: categoryInput.value,
    amount: parseFloat(amountInput.value)
  });

  saveExpenses();
  render();
  form.reset();
});

filterSelect.addEventListener("change", render);

render(); 