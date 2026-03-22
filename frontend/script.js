const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// 1. Load Tasks (Updated to include Delete Button)
async function loadTasks() {
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
}

// 2. Add Task
async function addTask() {
    const text = taskInput.value;
    if (!text) return alert("Type something!");

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    });

    taskInput.value = '';
    loadTasks();
}

// 3. Delete Task (New Function)
async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadTasks(); // Refresh the list after deleting
    }
}

loadTasks();