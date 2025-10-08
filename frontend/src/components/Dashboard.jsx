import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newPriority, setNewPriority] = useState('Medium');
    const [newDueDate, setNewDueDate] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'border-l-4 border-red-500';
            case 'Medium': return 'border-l-4 border-yellow-500';
            case 'Low': return 'border-l-4 border-green-500';
            default: return 'border-l-4 border-slate-500';
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', {
                name: newTaskName,
                priority: newPriority,
                dueDate: newDueDate || null
            });
            setTasks([...tasks, response.data]);
            setNewTaskName('');
            setNewPriority('Medium');
            setNewDueDate('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleToggleComplete = async (taskId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`);
            const updatedTask = response.data;
            
            setTasks(tasks.map(task =>
                task._id === taskId ? updatedTask : task
            ));

            if (updatedTask.completed) {
                showNotification('Task Completed! 🎉');
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
            showNotification('Task Deleted!');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {notification && (
                <div className="bg-green-500 text-white text-center p-3 rounded-lg mb-4 shadow-lg animate-pulse">
                    {notification}
                </div>
            )}

            <form onSubmit={handleAddTask} className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Add a new task..."
                        className="sm:col-span-2 p-3 bg-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="p-3 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="p-3 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-3 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Add Task
                </button>
            </form>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className={`bg-slate-800 p-4 rounded-lg flex justify-between items-center transition-all duration-300 ${getPriorityClass(task.priority)} ${task.completed ? 'opacity-50' : ''}`}
                    >
                        <div>
                            <p className={`text-lg text-slate-100 ${task.completed ? 'line-through' : ''}`}>
                                {task.name}
                            </p>
                            {task.dueDate && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleToggleComplete(task._id)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
                            >
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;