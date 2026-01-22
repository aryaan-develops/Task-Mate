
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, CheckCircle, Clock } from 'lucide-react';
import API_BASE_URL from '../config';

const UserProgressPage = () => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProgress();
    }, []);

    const fetchUserProgress = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/user-progress`);
            setProgressData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading user progress...</div>;

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-8">User Progress Overview</h1>

            {progressData.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-slate-50">
                    <p className="text-slate-400">No data available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {progressData.map(user => {
                        const completionRate = Math.round((user.completedTasks / user.totalTasks) * 100) || 0;

                        return (
                            <div key={user._id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-700">{user.name}</h3>
                                        <p className="text-sm text-slate-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-slate-500 font-medium">Completion Rate</span>
                                        <span className="text-3xl font-light text-slate-700">{completionRate}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-slate-700">{user.totalTasks}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total</span>
                                    </div>
                                    <div className="text-center border-l border-slate-100">
                                        <span className="block text-2xl font-bold text-green-500">{user.completedTasks}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Done</span>
                                    </div>
                                    <div className="text-center border-l border-slate-100">
                                        <span className="block text-2xl font-bold text-orange-400">{user.pendingTasks + user.inProgressTasks}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Pending</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserProgressPage;
