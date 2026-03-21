// 1. Run this function as soon as the page opens
window.onload = () => {
    loadTasks();
};

// 2. Function to add a task from the input fields
async function addTask() {
    const title = document.getElementById('taskInput').value;
    const priority = document.getElementById('priorityInput').value;

    if (!title) return alert("Please enter a task name!");

    const newTask = { title, priority, status: 'Backlog' };

    // Send the task to your Node.js server
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });

    if (response.ok) {
        document.getElementById('taskInput').value = ''; // Clear input
        loadTasks(); // Refresh the board
    }
}

// 3. Function to get tasks from MongoDB and show them on the UI
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    // Clear the columns first
    document.getElementById('backlog').innerHTML = '';
    document.getElementById('inprogress').innerHTML = '';
    document.getElementById('completed').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        
        // Add classes for styling (e.g., "task-card high")
        card.className = `task-card ${task.priority.toLowerCase()}`;
        
        card.innerHTML = `
            <h4>${task.title}</h4>
            <p>Priority: ${task.priority}</p>
            <button onclick="deleteTask('${task._id}')">🗑️ Delete</button>
        `;

        // Put the card in the correct column based on its status
        const columnId = task.status.toLowerCase().replace(" ", "");
        document.getElementById(columnId).appendChild(card);
    });
}

// 4. Function to delete a task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}