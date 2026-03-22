function addTask() {
    const nameInput = document.getElementById('taskName');
    const priorityInput = document.getElementById('taskPriority');
    const backlog = document.getElementById('backlog');

    if (nameInput.value.trim() === "") {
        alert("Please enter a task name!");
        return;
    }

    // Create the task card element
    const card = document.createElement('div');
    card.className = `task-card ${priorityInput.value.toLowerCase()}`;
    
    card.innerHTML = `
        <strong>${nameInput.value}</strong>
        <p>Priority: ${priorityInput.value}</p>
    `;

    // Add the card to the Backlog column
    backlog.appendChild(card);

    // Clear the input field for the next task
    nameInput.value = "";
}