
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../config';

const AssignTask = () => {
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null); // { type: 'success' | 'error', text: '' }

    // Fetch users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/users`);
                setUsers(res.data);
                if (res.data.length > 0) {
                    setAssignedTo(res.data[0]._id); // Default to first user
                }
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            await axios.post(`${API_BASE_URL}/admin/assign-task`, {
                title,
                description,
                assignedTo,
                priority,
                dueDate
            });
            setMsg({ type: 'success', text: 'Task assigned successfully!' });
            setTitle('');
            setDescription('');
            setDueDate(''); // Reset date
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to assign task';
            setMsg({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[40px] p-4 md:p-8 shadow-sm border border-slate-50 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Assign New Task</h2>

            {msg && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-500 font-medium mb-2 text-sm">Task Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                        placeholder="e.g. Redesign Homepage"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-500 font-medium mb-2 text-sm">Assign To</label>
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        {users.map(u => (
                            <option key={u._id} value={u._id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-slate-500 font-medium mb-2 text-sm">Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div>
                    <label className="block text-slate-500 font-medium mb-2 text-sm">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-500 font-medium mb-2 text-sm">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                        placeholder="Task details..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Assign Task'}
                </button>
            </form>
        </div>
    );
};

export default AssignTask;
