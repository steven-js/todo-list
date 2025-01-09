const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.getElementById("filter-btns");
const searchInput = document.getElementById("search-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskId = parseInt(localStorage.getItem("taskId")) || 0;
let currentFilter = "all";
let searchTerm = "";

// Debounce Function
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// Append new task
const appendTask = (task) => {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("data-id", task.id);

  // Create label to wrap checkbox and task text
  const label = document.createElement("label");
  label.classList.add("task-label");

  // Create checkbox input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  checkbox.checked = task.completed;

  // Create task text with strikethrough if completed
  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = task.text;
  if (task.completed) {
    taskText.classList.add("completed");
  }

  // Append checkbox and task text to label
  label.appendChild(checkbox);
  label.appendChild(taskText);

  // Create delete button
  const deleteBtn = document.createElement("button");
  //   deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

  // Append label and delete button to task item
  taskItem.appendChild(label);
  taskItem.appendChild(deleteBtn);

  // Append task item to task list
  taskList.appendChild(taskItem);

  // Listen for checkbox change
  checkbox.addEventListener("change", (e) => {
    task.completed = e.target.checked;
    taskText.classList.toggle("completed");
    saveTasks();
  });

  // Listen for deleting a task
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    taskItem.remove();
  });
};

// Save task to local storage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("taskId", taskId.toString());
};

// Disable button if input is empty
const toggleAddTaskButton = () => {
  if (taskInput.value === "") {
    addTaskBtn.disabled = true;
  } else {
    addTaskBtn.disabled = false;
  }
};

// Add new task
const addTask = () => {
  const task = taskInput.value.trim();
  if (!task) return;
  const newTask = { id: taskId++, text: task, completed: false };
  tasks.push(newTask);
  taskInput.value = "";
  toggleAddTaskButton();
  saveTasks();
  renderTasks();
};

// Render tasks based on filter
const renderTasks = () => {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" && task.completed) ||
      (currentFilter === "active" && !task.completed);

    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  filteredTasks.forEach(appendTask);
};

// Handle filter change
filterBtns.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    currentFilter = e.target.id;

    filterBtns.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    renderTasks();
  }
});

// Debounce search handler
const handleSearch = debounce((e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderTasks();
}, 300);

// Listen for search input change
searchInput.addEventListener("input", handleSearch);

// Listen for input field change
taskInput.addEventListener("input", toggleAddTaskButton);

// Listen for add task button click
addTaskBtn.addEventListener("click", addTask);

// Listen for Enter key press
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

renderTasks();
