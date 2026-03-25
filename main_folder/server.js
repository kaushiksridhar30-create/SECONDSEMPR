const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Added ObjectId for deleting
const app = express();
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`🚀 Server is live!`);
});

// 1. Middleware
app.use(express.json());
app.use(express.static('frontend')); // Serves your HTML/CSS/JS

// 2. Connection String (Replace with YOUR actual password)
const uri = "mongodb://kaushiksridhar30_db_user:teamuser12345@ac-bwrjiih-shard-00-00.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-01.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-02.vdvhqas.mongodb.net:27017/?ssl=true&replicaSet=atlas-aj10qk-shard-0&authSource=admin&appName=Cluster0teammanager";

const client = new MongoClient(uri, {
  family: 4 // Forces IPv4 to avoid connection errors
});

async function startServer() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const db = client.db("task_manager");
    const tasks = db.collection("tasks");

    // --- ROUTES ---

    // A. GET all tasks
    app.get('/api/tasks', async (req, res) => {
      const allTasks = await tasks.find({}).toArray();
      res.json(allTasks);
    });

    // B. POST (Add) a new task
    app.post('/api/tasks', async (req, res) => {
      const newTask = { 
        text: req.body.text, 
        createdAt: new Date() 
      };
      const result = await tasks.insertOne(newTask);
      res.status(201).json({ ...newTask, _id: result.insertedId });
    });

    // C. DELETE a task
    app.delete('/api/tasks/:id', async (req, res) => {
      try {
        const id = req.params.id;
        await tasks.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Task deleted" });
      } catch (err) {
        res.status(400).json({ error: "Invalid ID format" });
      }
    });

    // 3. Start listening
    app.listen(port, () => {
      console.log(`🚀 Server is live at http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

 startServer();
 // D. UPDATE (Toggle Complete)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await tasks.findOne({ _id: new ObjectId(id) });
        
        // Toggle the completed status (if it's true, make it false; if false, make it true)
        const newStatus = !task.completed;
        
        await tasks.updateOne(
            { _id: new ObjectId(id) },
            { $set: { completed: newStatus } }
        );
        
        res.json({ message: "Task updated", completed: newStatus });
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});
// PUT route to update task status
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await tasks.findOne({ _id: new ObjectId(id) });
        
        // If task doesn't have a 'completed' field yet, it defaults to false, then flips to true
        const newStatus = !task.completed;
        
        await tasks.updateOne(
            { _id: new ObjectId(id) },
            { $set: { completed: newStatus } }
        );
        
        res.json({ success: true, completed: newStatus });
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});
// A. GET tasks for a specific user
app.get('/api/tasks/:username', async (req, res) => {
    const username = req.params.username;
    const allTasks = await tasks.find({ user: username }).toArray();
    res.json(allTasks);
});

// B. POST a task with a username
app.post('/api/tasks', async (req, res) => {
    const newTask = { 
        text: req.body.text, 
        user: req.body.user, // Save who created it
        completed: false,
        createdAt: new Date() 
    };
    await tasks.insertOne(newTask);
    res.json(newTask);
});