// 1. GLOBAL STATE - Get user from memory
let currentUser = localStorage.getItem('taskUser');

// 2. INITIALIZATION - Run when page opens
window.onload = () => {
    if (currentUser) {
        showApp();
    }
};

// --- VIEW NAVIGATION ---

function login() {
    const input = document.getElementById('usernameInput');
    const user = input.value.trim();
    
    if (!user) {
        return alert("Please enter a name to continue.");
    }

    localStorage.setItem('taskUser', user);
    currentUser = user;
    showApp();
}

function logout() {
    localStorage.removeItem('taskUser');
    location.reload(); // Hard reset to login screen
}

function showApp() {
    // Switch the "Glass Cards"
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('app-view').classList.remove('hidden');
    
    // Personalize the Header
    document.getElementById('greet').innerText = `Tasks for ${currentUser}`;
    
    // Fetch the data from MongoDB
    loadTasks();
}

// --- DATABASE OPERATIONS ---

async function loadTasks() {
    const list = document.getElementById('taskList');
    
    try {
        // Fetching tasks filtered by the logged-in user
        const res = await fetch(`/api/tasks?user=${encodeURIComponent(currentUser)}`);
        const tasks = await res.json();
        
        list.innerHTML = ''; // Clear the UI before rebuilding

        if (tasks.length === 0) {
            list.innerHTML = `<li style="justify-content:center; opacity:0.6;">No tasks found. Add one below!</li>`;
            return;
        }

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask('${t._id}')">
                <span class="task-text ${t.completed ? 'completed' : ''}">${t.text}</span>
                <button class="delete-btn" onclick="deleteTask('${t._id}')">Delete</button>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (!text) return;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text, 
                user: currentUser 
            })
        });

        if (response.ok) {
            input.value = ''; // Clear input
            await loadTasks(); // Immediate Refresh
        }
    } catch (err) {
        console.error("Add Error:", err);
    }
}

async function toggleTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: 'PATCH' });
        if (res.ok) await loadTasks(); // Refresh to show the strikethrough
    } catch (err) {
        console.error("Update Error:", err);
    }
}

async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (res.ok) await loadTasks(); // Refresh to remove the item
    } catch (err) {
        console.error("Delete Error:", err);
    }
}

// --- UTILITIES ---

function searchTasks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('#taskList li');
    
    items.forEach(li => {
        const textElement = li.querySelector('.task-text');
        if (textElement) {
            const text = textElement.innerText.toLowerCase();
            li.style.display = text.includes(query) ? 'flex' : 'none';
        }
    });
}