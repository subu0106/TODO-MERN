const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const app = express() // creating a instance of express
app.use(cors())
app.use(express.json())

// // defining the route
// app.get('/',( req,res) =>{
//     res.send("Hello world!")
// })

// //Sample in memory storage for todo
// let todos =[]

//connecting mongoose
mongoose.connect('mongodb://localhost:27017/todo-mern')
.then(()=>{
    console.log("DB connected!")
})
.catch((err)=>{
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type : String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('todo', todoSchema)


// create a new todo
app.post('/todos',async(req,res)=>{
    const {title, description} =req.body;
    // const newTodo = {
    //     id:todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log(todos)
    
    try{
    const newTodo = new todoModel({title, description})
    await newTodo.save()
    res.status(201).json(newTodo)
    }
    catch (err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
})

//Get all items
app.get('/todos',async (req,res)=>{
    try{
        const todos = await todoModel.find()
        res.json(todos)
    }
    catch (err){
        console.log(err)
        res.status(500).json({message: err.message}) 
    }   
})

//Update todo item
app.put('/todos/:id',async (req,res)=>{
    try{
        const {title, description} =req.body;
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo)
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message}) 
    }
})

//Delete todo item
app.delete('/todos/:id',async(req,res)=>{
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end() 
    }
    catch{
        console.log(err)
        res.status(500).json({message: err.message}) 
    }
})
const PORT = 8000;

app.listen(PORT,()=>{
    console.log("Server is listening to the port: ", PORT)
} )