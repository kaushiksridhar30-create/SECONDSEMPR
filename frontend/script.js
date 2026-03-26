let currentUser = localStorage.getItem('username');

window.onload = () => {
    if (currentUser) showApp();
};

function login() {
    const user = document.getElementById('usernameInput').value.trim();
    if (user.length < 2) return alert("Enter a valid name");
    localStorage.setItem('username', user);
    currentUser = user;
    showApp();
}

function logout() {
    localStorage.removeItem('username');
    location.reload();
}

function showApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('welcomeText').innerText = `User: ${currentUser}`;
    loadTasks();
}

async function loadTasks() {
    const response = await fetch(`/api/tasks?user=${currentUser}`);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.text}</span> 
                        <button onclick="deleteTask('${task._id}')">Delete</button>`;
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput.value.trim()) return;
    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: taskInput.value, user: currentUser })
    });
    taskInput.value = '';
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

function searchTasks() {
    const filter = document.getElementById('searchInput').value.toLowerCase();
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(t => {
        const text = t.querySelector('span').textContent.toLowerCase();
        t.style.display = text.includes(filter) ? "" : "none";
    });
}