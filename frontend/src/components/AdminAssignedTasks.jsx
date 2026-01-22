
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import API_BASE_URL from '../config';

const AdminAssignedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedTasks();
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/assigned-tasks`);
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching assigned tasks", err);
            setLoading(false);
        }
    };

    const getStatusColor = (completed, status) => {
        if (completed) return 'text-green-500 bg-green-50';
        if (status === 'in-progress') return 'text-blue-500 bg-blue-50';
        return 'text-orange-500 bg-orange-50';
    };

    if (loading) return <div className="text-slate-400">Loading assigned tasks...</div>;

    return (
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 mb-8">
            <h2 className="text-xl font-bold text-slate-700 mb-6">Task Assignments & Progress</h2>

            {tasks.length === 0 ? (
                <div className="text-slate-400 text-center py-8">You haven't assigned any tasks yet.</div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                            {/* Task Info */}
                            <div className="mb-4 md:mb-0">
                                <h3 className="font-bold text-slate-700">{task.name}</h3>
                                {task.description && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{task.description}</p>}
                                <div className="flex items-center gap-2 mt-2 text-xs">
                                    <span className={`px-2 py-0.5 rounded-full font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                        {task.priority || 'Medium'}
                                    </span>
                                    {task.dueDate && (
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Assigned User & Status */}
                            <div className="flex items-center gap-4 md:gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">{task.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-slate-400">{task.user?.email}</p>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(task.completed, task.status)}`}>
                                    {task.completed ? (
                                        <>
                                            <CheckCircle className="w-3 h-3" />
                                            <span>Completed</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-3 h-3" />
                                            <span>{task.status === 'pending' ? 'Pending' : 'In Progress'}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminAssignedTasks;
