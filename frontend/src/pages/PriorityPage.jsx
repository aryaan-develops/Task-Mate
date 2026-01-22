
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Flag, Calendar, Trash2 } from 'lucide-react';
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/tasks`;

const PriorityPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'bg-red-50 border-red-200 text-red-600';
            case 'Medium': return 'bg-yellow-50 border-yellow-200 text-yellow-600';
            case 'Low': return 'bg-green-50 border-green-200 text-green-600';
            default: return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };

    const groupedTasks = {
        High: tasks.filter(t => t.priority === 'High' && !t.completed),
        Medium: tasks.filter(t => t.priority === 'Medium' && !t.completed),
        Low: tasks.filter(t => t.priority === 'Low' && !t.completed),
    };

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-8">Priority Board</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['High', 'Medium', 'Low'].map((priority) => (
                    <div key={priority}>
                        <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl border ${getPriorityColor(priority)} bg-opacity-50`}>
                            <Flag className="w-5 h-5" />
                            <h2 className="font-bold text-lg">{priority} Priority</h2>
                            <span className="ml-auto bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {groupedTasks[priority].length}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {groupedTasks[priority].map(task => (
                                <div key={task._id} className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 hover:shadow-md transition-all relative group">
                                    <h3 className="font-bold text-slate-700 mb-2">{task.name}</h3>
                                    {task.description && <p className="text-slate-400 text-xs mb-4 line-clamp-2">{task.description}</p>}

                                    <div className="flex items-center justify-between text-slate-400 text-xs mt-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {groupedTasks[priority].length === 0 && (
                                <div className="text-center py-10 text-slate-300 text-sm border-2 border-dashed border-slate-100 rounded-[30px]">
                                    No {priority.toLowerCase()} priority tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriorityPage;
