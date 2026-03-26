const uri = process.env.MONGODB_URI;

// This "if" statement prevents the crash you're seeing
if (!uri) {
    console.error("❌ ERROR: MONGODB_URI is not defined in Environment Variables!");
    process.exit(1); // Stops the server gracefully with a clear message
}

const client = new MongoClient(uri);
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Added ObjectId here
const app = express();

app.use(express.json());
app.use(express.static('frontend'));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let tasks;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('team_tasks');
        tasks = db.collection('tasks');
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
}
connectDB();

// --- THE FIXED ROUTES ---

// 1. GET TASKS (The usual spot for 500 errors)
app.get('/api/tasks', async (req, res) => {
    try {
        const username = req.query.user;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
        // Filter by user
        const userTasks = await tasks.find({ user: username }).toArray();
        res.json(userTasks);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ error: "Server failed to fetch tasks" });
    }
});

// 2. POST TASK
app.post('/api/tasks', async (req, res) => {
    try {
        const { text, user } = req.body;
        if (!text || !user) {
            return res.status(400).json({ error: "Text and User are required" });
        }
        const newTask = { 
            text, 
            user, 
            completed: false,
            createdAt: new Date() 
        };
        await tasks.insertOne(newTask);
        res.json(newTask);
    } catch (err) {
        console.error("POST Error:", err);
        res.status(500).json({ error: "Server failed to save task" });
    }
});

// 3. DELETE TASK
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await tasks.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE Error:", err);
        res.status(500).json({ error: "Server failed to delete" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));