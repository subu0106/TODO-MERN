const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-mern')
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.error("Database connection error:", err);
});

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
}, {
    timestamps: true
});

// Todo Model
const todoModel = mongoose.model('Todo', todoSchema);

// Create a new todo
app.post('/todos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update todo item
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
        
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        res.json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ message: err.message });
    }
});

// Delete todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await todoModel.findByIdAndDelete(id);
        
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});