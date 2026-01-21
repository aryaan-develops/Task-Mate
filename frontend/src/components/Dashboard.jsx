
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CloudRain,
    MoreHorizontal,
    Plus,
    Calendar,
    Clock,
    Paperclip,
    MessageSquare,
    CheckCircle,
    Trash2,
    RefreshCw,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AssignTask from './AssignTask';
import AdminAssignedTasks from './AdminAssignedTasks';

const API_URL = 'http://localhost:5000/api/tasks';

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTaskName, setNewTaskName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Greeting time
    const today = new Date();
    const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        try {
            const response = await axios.post(API_URL, {
                name: newTaskName,
                priority: 'Medium', // Default
                dueDate: new Date()
            });
            setTasks([...tasks, response.data]);
            setNewTaskName('');
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const response = await axios.put(`${API_URL}/${task._id}`, {
                completed: !task.completed
            });
            setTasks(tasks.map(t => t._id === task._id ? response.data : t));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const openTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                {/* Greeting Widget */}
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 relative overflow-hidden shadow-sm flex items-center justify-between">
                    <div className="z-10 relative">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>Renew Account</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-700 mb-1">Good Morning, {user?.name || 'User'}</h1>
                        <p className="text-slate-400 text-sm mb-6">Have a fruitful day ahead! 🌤️</p>

                        <div className="text-5xl font-light text-slate-700">
                            {timeString}
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="hidden md:flex absolute right-0 bottom-0 top-0 w-1/2 items-end justify-end pointer-events-none">
                        <img src="/assets/collaboration.png" alt="Collaboration" className="h-[120%] object-contain -mb-4 -mr-4" />
                    </div>
                </div>

                {/* Weather Widget */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <CloudRain className="w-12 h-12 text-blue-200" />
                        <span className="text-4xl font-light text-slate-700">26°</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 text-lg">Heavy Rain</h3>
                        <p className="text-slate-400 text-xs mt-1">Lagos, {dateString}</p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
                </div>
            </div>



            {isAdmin && (
                <div className="mb-10">
                    <AdminAssignedTasks />
                </div>
            )}

            {/* Board Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">

                {/* Column 1: Open */}
                <div>
                    <h2 className="text-xl text-slate-500 font-medium mb-6 px-2">Open</h2>
                    <div className="space-y-4">
                        {openTasks.map(task => (
                            <div key={task._id} className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-50 relative group hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-2">
                                        <span className="bg-blue-50 text-blue-500 p-2 rounded-full"><Bell className="w-4 h-4" /></span>
                                    </div>
                                    <button onClick={() => handleDelete(task._id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-700 mb-2">#{task._id.slice(-4)} {task.name}</h3>
                                {task.description && (
                                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                                    <div className="flex -space-x-2">
                                        <img src="https://i.pravatar.cc/100?img=12" className="w-6 h-6 rounded-full border-2 border-white" />
                                        <img src="https://i.pravatar.cc/100?img=13" className="w-6 h-6 rounded-full border-2 border-white" />
                                    </div>
                                    <span className="ml-1">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</span>
                                </div>

                                <button
                                    onClick={() => handleToggleComplete(task)}
                                    className="absolute bottom-6 right-6 w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 hover:border-green-500 hover:text-green-500 transition-colors">
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Add Card Button / Form */}
                        {isAdding ? (
                            <form onSubmit={handleAddTask} className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-50">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Task title..."
                                    className="w-full text-slate-700 font-bold placeholder-slate-300 outline-none mb-3"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 text-sm hover:text-slate-600">Cancel</button>
                                    <button type="submit" className="text-blue-500 font-medium text-sm hover:text-blue-600">Add</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setIsAdding(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[30px] text-slate-400 font-medium hover:border-slate-300 hover:text-slate-500 transition-colors">
                                Add Card
                            </button>
                        )}
                    </div>
                </div>

                {/* Column 2: Description (Visual Placeholder for now, or completed tasks?) */}
                {/* To match image, I'll put some static "In Progress" looking cards or maybe "Completed" tasks here for now */}
                <div>
                    <h2 className="text-xl text-slate-500 font-medium mb-6 px-2">Description</h2>

                    {/* A Featured Card (Hardcoded to match image style) */}
                    <div className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-50 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-slate-700 font-bold text-lg">#53 Load-Up</span>
                            <MoreHorizontal className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            In Hac Habitasse Platea Dictumst. Vivamus Sit Udfo Ame Vivamus Sit Amet Sem Vitae Tellus.
                        </p>

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-slate-400 text-xs block mb-1">High Priority</span>
                                <div className="flex text-orange-400 text-xs font-bold gap-1 items-center">
                                    <Clock className="w-3 h-3" /> 2/3
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-slate-400 text-xs block mb-1">12/06/2020</span>
                                <div className="flex -space-x-2">
                                    <img src="https://i.pravatar.cc/100?img=3" className="w-6 h-6 rounded-full border-2 border-white" />
                                    <img src="https://i.pravatar.cc/100?img=4" className="w-6 h-6 rounded-full border-2 border-white" />
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] text-slate-500">+2</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Paperclip className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-500 text-sm">Attachments</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">+</div>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400"><Paperclip className="w-4 h-4" /></div>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400"><Paperclip className="w-4 h-4" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Another card */}
                    <div className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-50 opacity-60">
                        <div className="flex gap-3 items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                <img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 rounded-full" />
                            </div>
                            <div>
                                <h4 className="text-slate-700 font-bold text-sm">In Hac Habitasse Platea</h4>
                                <p className="text-slate-400 text-xs">Dictumst Vivamus</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Column 3: Status (Analytics) */}
                <div>
                    <h2 className="text-xl text-slate-500 font-medium mb-6 px-2">Status</h2>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 text-center mb-6">
                        <h3 className="text-slate-400 text-sm mb-6">In Progress</h3>

                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {/* Simple CSS Circle Progress */}
                            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    className="text-blue-500"
                                    strokeDasharray={`${(completedTasks.length / (tasks.length || 1)) * 100}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="text-4xl font-light text-slate-700">{tasks.length - completedTasks.length}</span>
                                <span className="block text-[10px] text-slate-400">Total Tasks</span>
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs">Due Date: 12/06/2020</p>
                    </div>

                    <div className="relative h-64 flex items-end justify-center">
                        <img src="/assets/umbrella.png" alt="Relax" className="h-full object-contain" />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;