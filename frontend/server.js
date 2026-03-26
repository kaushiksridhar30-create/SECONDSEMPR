const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); 

const uri = "mongodb://kaushiksridhar30_db_user:teamuser12345@ac-bwrjiih-shard-00-00.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-01.vdvhqas.mongodb.net:27017,ac-bwrjiih-shard-00-02.vdvhqas.mongodb.net:27017/?ssl=true&replicaSet=atlas-aj10qk-shard-0&authSource=admin&appName=Cluster0teammanager";
const client = new MongoClient(uri);
let tasks;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('team_tasks');
        tasks = db.collection('tasks');
        console.log("✅ MongoDB Connected!");
    } catch (err) {
        console.error("❌ Connection Error:", err);
    }
}
connectDB();

app.get('/api/tasks', async (req, res) => {
    const userTasks = await tasks.find({ user: req.query.user }).toArray();
    res.json(userTasks);
});

app.post('/api/tasks', async (req, res) => {
    const newTask = { text: req.body.text, user: req.body.user, completed: false };
    await tasks.insertOne(newTask);
    res.json(newTask);
});

app.patch('/api/tasks/:id', async (req, res) => {
    const task = await tasks.findOne({ _id: new ObjectId(req.params.id) });
    await tasks.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { completed: !task.completed } }
    );
    res.json({ success: true });
});

app.delete('/api/tasks/:id', async (req, res) => {
    await tasks.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));