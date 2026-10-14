const form = document.getElementById("expense-form");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const filterSelect = document.getElementById("filter");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const categories = ["Food", "Transport", "Bills", "Fun"];

// Which expense is currently being edited (null means none)
let editingExpense = null;

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

    if (expense === editingExpense) {
      // EDIT MODE: show a dropdown, an amount box and a Save button

      const categorySelect = document.createElement("select");
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        if (cat === expense.category) {
          option.selected = true;
        }
        categorySelect.appendChild(option);
      });

      const amountBox = document.createElement("input");
      amountBox.type = "number";
      amountBox.step = "0.01";
      amountBox.value = expense.amount;

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";

      saveButton.addEventListener("click", function () {
        const newAmount = parseFloat(amountBox.value);

        if (isNaN(newAmount)) {
          alert("Please enter a valid amount");
          return;
        }

        expense.category = categorySelect.value;
        expense.amount = newAmount;
        editingExpense = null; // leave edit mode

        saveExpenses();
        render();
      });

      li.appendChild(categorySelect);
      li.appendChild(amountBox);
      li.appendChild(saveButton);

    } else {
      // NORMAL MODE: show the text with Edit and Delete buttons

      li.textContent = `${expense.category}: ${expense.amount.toFixed(2)} `;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";

      editButton.addEventListener("click", function () {
        editingExpense = expense; // remember which expense to edit
        render();
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        const index = expenses.indexOf(expense);
        expenses.splice(index, 1);

        saveExpenses();
        render();
      });

      li.appendChild(editButton);
      li.appendChild(deleteButton);
    }

    list.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); 
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