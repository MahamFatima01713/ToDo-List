const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");
let todos = [];
let currentFilter = "all";
loadTodos();
addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTodo();
});
clearCompletedBtn.addEventListener("click", function () {
  clearCompleted();
});

function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") {
    alert("Please enter a task!");
    return;
  }
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
  };
  todos.push(newTodo);
  todoInput.value = "";
  saveAndRender();
}
function deleteTodo(id) {
  let newTodos = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id !== id) {
      newTodos.push(todos[i]);
    }
  }
  todos = newTodos;
  saveAndRender();
}
function toggleTodo(id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      if (todos[i].completed === true) {
        todos[i].completed = false;
      } else {
        todos[i].completed = true;
      }
      break;
    }
  }
  saveAndRender();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveAndRender();
}
function setFilter(filter) {
  console.log("Filter clicked: " + filter);
  currentFilter = filter;

  filterBtns.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  render();
}
function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => todo.completed === false);
  } else if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed === true);
  } else {
    return todos;
  }
}

function updateTaskCount() {
  let count = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].completed === false) {
      count = count + 1;
    }
  }
  if (count === 1) {
    taskCount.textContent = count + " task left";
  } else {
    taskCount.textContent = count + " tasks left";
  }
}
function render() {
  const filteredTodos = getFilteredTodos();
  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<div class="emptymessage">No tasks to show</div>`;
    updateTaskCount();
    return;
  }

  todoList.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed === true) {
      li.className = li.className + " completed";
    }
    li.innerHTML = `
  <input type="checkbox" class="todo-checkbox"  ${todo.completed ? "checked" : ""}>
  <span class="todo-text">${escapeHtml(todo.text)}</span> 
  <button class="delete-btn">Delete</button>
`;

    const checkbox = li.querySelector(".todo-checkbox");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
    todoList.appendChild(li);
  });

  updateTaskCount();
}
function saveAndRender() {
  saveTodos();
  render();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); //JSON.stringify convert array into strings
}

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved); //Converts saved text back into an array
  }
  render();
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.onclick = function () {
    setFilter(this.getAttribute("data-filter"));
  };
});

setFilter("all");
loadTodos();
