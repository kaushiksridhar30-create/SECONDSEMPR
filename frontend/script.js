const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// 1. Fetch and Display Tasks
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        taskList.innerHTML = ''; 
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
            `;
            taskList.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

// 2. Add a Task to MongoDB
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert("Please type a task!");

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (response.ok) {
            taskInput.value = '';
            loadTasks(); // Refresh list
        }
    } catch (err) {
        alert("Failed to save task. Check server terminal.");
    }
}

// 3. Delete a Task from MongoDB
async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTasks(); // Refresh list
        }
    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

// Initial load
loadTasks();
// Replace your loadTasks and add toggleTask
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
        const li = document.createElement('li');
        // Add a class if the task is completed
        if (task.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span onclick="toggleTask('${task._id}')" style="cursor:pointer; text-decoration: ${task.completed ? 'line-through' : 'none'}">
                ${task.text}
            </span>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// NEW: Update Function
async function toggleTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'PUT' });
    loadTasks(); // Refresh to show the strike-through
}
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    
    taskList.innerHTML = ''; 
    tasks.forEach(task => {
        const li = document.createElement('li');
        // Add a class for styling if done
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onclick="toggleTask('${task._id}')">
                <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
                    ${task.text}
                </span>
            </div>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Function to call the Update route
async function toggleTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT'
        });
        if (response.ok) {
            loadTasks(); // Refresh UI to show the checkmark and line-through
        }
    } catch (err) {
        console.error("Update failed:", err);
    }
}
// NEW: Search Functionality
function searchTasks() {
    const filter = document.getElementById('searchInput').value.toLowerCase();
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const text = task.querySelector('span').textContent.toLowerCase();
        if (text.includes(filter)) {
            task.style.display = ""; // Show
        } else {
            task.style.display = "none"; // Hide
        }
    
    });
}
let currentUser = localStorage.getItem('username');

// 1. Check if already logged in
if (currentUser) {
    showApp();
}

function login() {
    const user = document.getElementById('usernameInput').value.trim();
    if (!user) return alert("Enter a name!");
    localStorage.setItem('username', user);
    currentUser = user;
    showApp();
}

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    loadTasks();
}

// 2. Update your loadTasks to use the username
async function loadTasks() {
    const response = await fetch(`/api/tasks/${currentUser}`);
    const tasks = await response.json();
    // ... rest of your existing loadTasks code ...
}

// 3. Update addTask to send the username
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, user: currentUser }) // Send user here
    });
    taskInput.value = '';
    loadTasks();
}
