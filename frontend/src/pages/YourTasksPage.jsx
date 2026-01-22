
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/tasks`;

const YourTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            // Optimistic update
            const updatedTasks = tasks.map(t =>
                t._id === taskId ? { ...t, status: newStatus, completed: newStatus === 'completed' } : t
            );
            setTasks(updatedTasks);

            await axios.put(`${API_URL}/${taskId}`, { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
            fetchTasks(); // Revert on error
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading your tasks...</div>;

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Your Tasks</h1>
            <p className="text-slate-500 mb-8">Update your progress so the admin knows where you stand.</p>

            <div className="grid gap-6">
                {tasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-slate-50">
                        <p className="text-slate-400">No tasks assigned to you yet.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="bg-white p-6 rounded-[30px] border border-slate-50 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-slate-700">{task.name}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {task.priority || 'Medium'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Clock className="w-4 h-4" />
                                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1 min-w-[140px]">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Status</span>
                                    <select
                                        value={task.status || 'pending'}
                                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                        className={`p-3 rounded-xl border-2 font-medium outline-none cursor-pointer transition-colors ${task.status === 'completed' ? 'border-green-100 bg-green-50 text-green-600' :
                                            task.status === 'in-progress' ? 'border-blue-100 bg-blue-50 text-blue-600' :
                                                'border-slate-100 bg-slate-50 text-slate-500'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default YourTasksPage;
