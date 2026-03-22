const express = require('express');
const { MongoClient } = require('mongodb');
const app = express(); // This is the "app" variable causing the error!

// 1. Settings
app.use(express.json());
app.use(express.static('frontend')); 

// 2. YOUR CONNECTION STRING
// Replace this with your actual string from Atlas!
const uri = "mongodb://kaushiksridhar30_db_user:teamuser12345@ac-bwrjiih-shard-00-00.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-01.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-02.vdvhqas.mongodb.net:27017/?ssl=true&replicaSet=atlas-aj10qk-shard-0&authSource=admin&appName=Cluster0teammanager";

const client = new MongoClient(uri, {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // This helps bypass the DNS/ECONNREFUSED error
});

async function start() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const db = client.db("task_manager");
    const tasks = db.collection("tasks");

    // Route to get tasks
    app.get('/api/tasks', async (req, res) => {
      const allTasks = await tasks.find({}).toArray();
      res.json(allTasks);
    });

    app.listen(3000, () => {
      console.log("🚀 Server is live at http://localhost:3000");
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

start();
// Add this route to server.js
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await tasks.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 1) {
            res.json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});