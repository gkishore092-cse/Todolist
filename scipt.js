let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
function addTask() {
    const input = document.getElementById("taskInput");
    const date = document.getElementById("taskDate");
    const priority = document.getElementById("priority");

    const taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        date: date.value,
        priority: priority.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    input.value = "";
    date.value = "";
    priority.value = "Medium";
}

// Display tasks
function displayTasks() {
    const taskList = document.getElementById("taskList");
    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(search);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<li class="empty">No tasks found!</li>';
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "task-info";

        const name = document.createElement("strong");
        name.textContent = task.name;

        if (task.completed) {
            name.classList.add("completed");
        }

        const details = document.createElement("p");
        details.textContent =
            `Priority: ${task.priority} | Due: ${task.date || "No date"}`;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.onclick = () => toggleTask(task.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteTask(task.id);

        info.append(name, details);
        actions.append(completeBtn, editBtn, deleteBtn);

        li.append(info, actions);
        taskList.appendChild(li);
    });

    updateStats();
}

// Complete or undo task
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

// Edit task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    const newName = prompt("Edit your task:", task.name);

    if (newName === null) return;

    if (newName.trim() === "") {
        alert("Task name cannot be empty!");
        return;
    }

    task.name = newName.trim();

    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    displayTasks();
}

// Update task statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

// Clear completed tasks
function clearCompleted() {
    if (confirm("Delete all completed tasks?")) {
        tasks = tasks.filter(task => !task.completed);

        saveTasks();
        displayTasks();
    }
}

// Initial display
displayTasks();