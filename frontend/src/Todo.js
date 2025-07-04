import { useEffect, useState } from "react"
import { useTheme } from './ThemeContext'

export default function Todo() {
    const { isDark, toggleTheme } = useTheme()
    
    // Common CSS classes
    const styles = {
        container: "min-h-screen transition-colors duration-300",
        header: "shadow-xl transition-colors duration-300 text-white",
        card: "rounded-xl shadow-lg border overflow-hidden transition-colors duration-300",
        cardHeader: "px-6 py-4 transition-colors duration-300",
        input: "w-full px-4 py-3 border-2 rounded-lg transition-all duration-200",
        button: "rounded-lg transition-all duration-200 font-medium",
        iconButton: "p-2 flex items-center justify-center",
        alert: "border-l-4 p-4 mb-6 rounded-r-lg transition-colors duration-300",
        taskItem: "border-2 rounded-xl p-6 hover:shadow-md transition-all duration-200"
    }
    
    const getThemeClasses = (lightClass, darkClass) => 
        isDark ? darkClass : lightClass
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [todos, setTodos] = useState([])
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editId, setEditId] = useState(-1)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const apiUrl = "http://localhost:8000"

    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(apiUrl + '/todos')
            .then((res) => res.json())
            .then((res) => {
                setTodos(res)
            })
    }

    const handleSubmit = () => {
        setError('')
        setMessage('')
        if (title.trim() && description.trim()) {
            fetch(apiUrl + '/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) return res.json()
                setError('Unable to create todo item')
                throw new Error('Failed to create todo')
            }).then((newTodo) => {
                setTodos([...todos, newTodo])
                setTitle('')
                setDescription('')
                setMessage("Item added successfully!")
                setTimeout(() => setMessage(""), 3000)
            }).catch((error) => {
                console.error('Error:', error)
                setError('Failed to create todo item')
            })
        } else {
            setError('Please fill in both title and description')
        }
    }

    const handleUpdate = () => {
        setError('')
        setMessage('')
        if (editTitle.trim() && editDescription.trim()) {
            fetch(apiUrl + '/todos/' + editId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) =>
                        item._id === editId
                            ? { ...item, title: editTitle, description: editDescription }
                            : item
                    )
                    setTodos(updatedTodos)
                    setEditTitle("")
                    setEditDescription("")
                    setEditId(-1)
                    setMessage("Item updated successfully!")
                    setTimeout(() => setMessage(""), 3000)
                } else {
                    setError('Unable to update todo item')
                }
            }).catch((error) => {
                console.error('Error:', error)
                setError('Failed to update todo item')
            })
        } else {
            setError('Please fill in both title and description')
        }
    }

    const handleEdit = (item) => {
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
    }

    const handleEditCancel = () => {
        setEditId(-1)
        setEditTitle("")
        setEditDescription("")
        setError('')
        setMessage('')
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: 'DELETE'
            }).then((res) => {
                if (res.ok) {
                    setTodos(todos.filter((item) => item._id !== id))
                    setMessage("Item deleted successfully!")
                    setTimeout(() => setMessage(""), 3000)
                } else {
                    setError('Failed to delete todo item')
                }
            }).catch((error) => {
                console.error('Error:', error)
                setError('Failed to delete todo item')
            })
        }
    }

    return (
        <div className={`${styles.container} ${getThemeClasses('bg-gradient-to-br from-sky-50 to-sky-100', 'dark bg-gray-900')}`}>
            {/* Header */}
            <div className={`${styles.header} ${getThemeClasses('bg-gradient-to-r from-sky-700 to-sky-800', 'bg-gradient-to-r from-gray-800 to-gray-900')}`}>
                <div className="container mx-auto px-6 py-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-center mb-2">Personal Task Manager</h1>
                            <p className={`text-center text-lg ${getThemeClasses('text-sky-100', 'text-gray-300')}`}>
                                Organize your life, one task at a time
                            </p>
                        </div>
                        
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`ml-4 p-3 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                getThemeClasses(
                                    'bg-gray-800 hover:bg-gray-700 text-yellow-400 focus:ring-gray-500',
                                    'bg-yellow-500 hover:bg-yellow-400 text-gray-900 focus:ring-yellow-400'
                                )
                            }`}
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                {/* Add Todo Section */}
                <div className={`${styles.card} mb-8 ${getThemeClasses('bg-white border-sky-200', 'bg-gray-800 border-gray-700')}`}>
                    <div className={`${styles.cardHeader} ${getThemeClasses('bg-gradient-to-r from-sky-600 to-sky-700', 'bg-gradient-to-r from-gray-700 to-gray-800')}`}>
                        <h3 className="text-xl font-semibold text-white flex items-center">
                            Add New Task
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        {message && (
                            <div className={`${styles.alert} ${getThemeClasses(
                                'bg-green-50 border-green-500 text-green-700',
                                'bg-green-900/20 border-green-400 text-green-300'
                            )}`}>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    {message}
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className={`${styles.alert} ${getThemeClasses(
                                'bg-red-50 border-red-500 text-red-700',
                                'bg-red-900/20 border-red-400 text-red-300'
                            )}`}>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    getThemeClasses('text-gray-700', 'text-gray-300')
                                }`}>Task Title</label>
                                <input 
                                    type="text"
                                    placeholder="Enter task title..." 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`${styles.input} ${getThemeClasses(
                                        'bg-white border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
                                        'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500'
                                    )}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    getThemeClasses('text-gray-700', 'text-gray-300')
                                }`}>Description</label>
                                <input 
                                    type="text"
                                    placeholder="Enter task description..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`${styles.input} ${getThemeClasses(
                                        'bg-white border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
                                        'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500'
                                    )}`}
                                />
                            </div>
                        </div>
                        
                        <button 
                            className={`w-full md:w-auto font-semibold py-3 px-8 ${styles.button} transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg ${
                                getThemeClasses(
                                    'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white focus:ring-sky-500',
                                    'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500'
                                )
                            }`}
                            onClick={handleSubmit}
                        >
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Tasks List Section */}
                <div className={`${styles.card} ${getThemeClasses('bg-white border-sky-200', 'bg-gray-800 border-gray-700')}`}>
                    <div className={`${styles.cardHeader} ${getThemeClasses('bg-gradient-to-r from-sky-600 to-sky-700', 'bg-gradient-to-r from-gray-700 to-gray-800')}`}>
                        <h3 className="text-xl font-semibold text-white flex items-center justify-between">
                            <span className="flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                Your Tasks
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                                getThemeClasses('bg-sky-400 text-sky-900', 'bg-gray-600 text-gray-200')
                            }`}>
                                {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
                            </span>
                        </h3>
                    </div>
                    
                    <div className="p-6">
                        {todos.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                                    getThemeClasses('text-sky-300', 'text-gray-600')
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <h4 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                                    getThemeClasses('text-gray-600', 'text-gray-400')
                                }`}>No tasks yet</h4>
                                <p className="text-gray-500 transition-colors duration-300">
                                    Add your first task to get started!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todos.map((item) => (
                                    <div key={item._id} className={`${styles.taskItem} ${getThemeClasses(
                                        'bg-gradient-to-r from-sky-50 to-sky-100 border-sky-200',
                                        'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600'
                                    )}`}>
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                {editId !== item._id ? (
                                                    <div>
                                                        <h4 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                                                            getThemeClasses('text-gray-800', 'text-gray-200')
                                                        }`}>{item.title}</h4>
                                                        <p className={`transition-colors duration-300 ${
                                                            getThemeClasses('text-gray-600', 'text-gray-400')
                                                        }`}>{item.description}</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <input 
                                                            type="text"
                                                            placeholder="Edit title..." 
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 ${
                                                                getThemeClasses(
                                                                    'bg-white border-sky-300 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
                                                                    'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500'
                                                                )
                                                            }`}
                                                        />
                                                        <input 
                                                            type="text"
                                                            placeholder="Edit description..." 
                                                            value={editDescription}
                                                            onChange={(e) => setEditDescription(e.target.value)}
                                                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 ${
                                                                getThemeClasses(
                                                                    'bg-white border-sky-300 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
                                                                    'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500'
                                                                )
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {editId !== item._id ? (
                                                    <>
                                                        <button 
                                                            className={`${styles.button} ${styles.iconButton} bg-yellow-500 hover:bg-yellow-600 text-white`}
                                                            onClick={() => handleEdit(item)}
                                                            title="Edit task"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            className={`${styles.button} ${styles.iconButton} bg-red-500 hover:bg-red-600 text-white`}
                                                            onClick={() => handleDelete(item._id)}
                                                            title="Delete task"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            className={`${styles.button} ${styles.iconButton} bg-green-500 hover:bg-green-600 text-white`}
                                                            onClick={handleUpdate}
                                                            title="Save changes"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            className={`${styles.button} ${styles.iconButton} bg-gray-500 hover:bg-gray-600 text-white`}
                                                            onClick={handleEditCancel}
                                                            title="Cancel editing"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
