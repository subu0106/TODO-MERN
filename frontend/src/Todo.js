import { useEffect, useState } from "react"

export default function Todo(){
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [todos, setTodos] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editId, setEditId] = useState(-1)

    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const apiUrl ="http://localhost:8000"

    const handleSubmit = ()=>{
        setError('')
        setMessage('')
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiUrl + '/todos',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    return res.json()
                } else {
                    setError('Unable to create todo item')
                    throw new Error('Failed to create todo')
                }
            }).then((newTodo) => {
                setTodos([...todos, newTodo])
                setTitle('')
                setDescription('')
                setMessage("Item added successfully!")
                setTimeout(()=>{
                    setMessage("");
                },3000)
            }).catch((error) => {
                console.error('Error creating todo:', error)
                setError('Failed to create todo item')
            })           
        } else {
            setError('Please fill in both title and description')
        }
    }
    const handleUpdate = ()=>{
        setError('')
        setMessage('')
        if(editTitle.trim() !== '' && editDescription.trim() !== ''){
            fetch(apiUrl + '/todos/'+editId,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: editTitle,description: editDescription })
            }).then((res)=>{
                if(res.ok){
                    const updatedTodos=todos.map((item)=>{
                        if (item._id ===editId){
                            item.title =editTitle
                            item.description = editDescription
                        }
                        return item
                    })
                    setTodos(updatedTodos)
                    setEditTitle("")
                    setEditDescription("")
                    setMessage("Item updated successfully!")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    setEditId(-1)
                }else{
                    setError('Unable to update todo item')
                }
            }).catch((error) => {
                console.error('Error updating todo:', error)
                setError('Failed to update todo item')
            })           
        } else {
            setError('Please fill in both title and description')
        }
    }

    useEffect(()=>{
        getItems()
    },[])

    const getItems = ()=>{
        fetch(apiUrl+'/todos')
        .then((res) => res.json())
        .then((res)=>{
            setTodos(res)
        })
    }

    const handleEdit=(item)=>{
        setEditId(item._id); 
        setEditTitle(item.title); 
        setEditDescription(item.description)
    }

    const handleEditCancel = ()=>{
        setEditId(-1)
        setEditTitle("")
        setEditDescription("")
        setError('')
        setMessage('')
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            fetch(apiUrl+'/todos/'+id, {
                method: "DELETE"
            })
            .then((res) => {
                if(res.ok) {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                    setMessage("Item deleted successfully!")
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                } else {
                    setError('Failed to delete todo item')
                }
            })
            .catch((error) => {
                console.error('Error deleting todo:', error)
                setError('Failed to delete todo item')
            })
        }
    }

    return <>
    <div className="row p-3 bg-success text-light">
        <h1>Personal Task List</h1>
    </div>
    <div className="row">
        <h3>Add items</h3>
        <div className="form-group d-flex gap-2">
            {message && <p className="text-success">{message}</p>}
            <input placeholder="title" onChange={(e)=> setTitle(e.target.value)} className="form-control" value={title} type="text"></input>
            <input placeholder="description" onChange={(e)=> setDescription(e.target.value)} className="form-control" value={description} type= "text"></input>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>

    <div className="row mt-3">
        <h3>Tasks Todo</h3>
        <ul className="list-group">
            {
                todos.map((item) =>
                    <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center my-2">
                        <div className="d-flex flex-column me-2">
                            {
                                editId === -1 || editId !== item._id ? <>
                                    <span className="fw-bold">{item.title}</span>
                                    <span>{item.description}</span>
                                </> : <>
                                    <input 
                                        placeholder="title" 
                                        onChange={(e)=> setEditTitle(e.target.value)} 
                                        className="form-control mb-2" 
                                        value={editTitle} 
                                        type="text"
                                    />
                                    <input 
                                        placeholder="description" 
                                        onChange={(e)=> setEditDescription(e.target.value)} 
                                        className="form-control" 
                                        value={editDescription} 
                                        type="text"
                                    />
                                </>
                            }
                        </div>
                        
                        <div className="d-flex gap-2">
                            {editId === -1 || editId !== item._id ? 
                                <>
                                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                </> : 
                                <>
                                    <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                                    <button className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
                                </>
                            }
                        </div>
                    </li>
                )
            }
        </ul>
    </div>
    </>

}