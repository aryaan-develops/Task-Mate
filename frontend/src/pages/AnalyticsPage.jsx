
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PieChart,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Activity
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/tasks';

const AnalyticsPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(API_URL);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks details for analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Calculate Stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Priority Stats
    const highPriority = tasks.filter(t => t.priority === 'High').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low').length;

    if (loading) return <div className="p-8 text-slate-400">Loading analytics...</div>;

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-slate-700 mb-2">Analytics Overview</h1>
            <p className="text-slate-400 mb-8">Track your productivity and task progress.</p>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Completion Rate Card */}
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-blue-500">
                            <Activity className="w-6 h-6" />
                            <span className="font-semibold text-sm uppercase tracking-wider">Completion Rate</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-slate-700">{completionRate}%</span>
                            <span className="text-slate-400 text-sm mb-1">of all tasks</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Total Tasks */}
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-purple-500">
                            <PieChart className="w-6 h-6" />
                            <span className="font-semibold text-sm uppercase tracking-wider">Total Tasks</span>
                        </div>
                        <span className="text-4xl font-bold text-slate-700">{totalTasks}</span>
                        <p className="text-slate-400 text-xs mt-2">Lifetime tasks created</p>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-orange-500">
                            <Clock className="w-6 h-6" />
                            <span className="font-semibold text-sm uppercase tracking-wider">Pending</span>
                        </div>
                        <span className="text-4xl font-bold text-slate-700">{pendingTasks}</span>
                        <p className="text-slate-400 text-xs mt-2">Tasks remaining</p>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-green-500">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-semibold text-sm uppercase tracking-wider">Completed</span>
                        </div>
                        <span className="text-4xl font-bold text-slate-700">{completedTasks}</span>
                        <p className="text-slate-400 text-xs mt-2">Tasks finished</p>
                    </div>
                </div>
            </div>

            {/* Detailed Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Priority Distribution */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
                    <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-slate-400" />
                        Priority Breakdown
                    </h3>

                    <div className="space-y-6">
                        {/* High */}
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-slate-600">High Priority</span>
                                <span className="text-slate-400">{highPriority} tasks</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${totalTasks ? (highPriority / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Medium */}
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-slate-600">Medium Priority</span>
                                <span className="text-slate-400">{mediumPriority} tasks</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${totalTasks ? (mediumPriority / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Low */}
                        <div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-slate-600">Low Priority</span>
                                <span className="text-slate-400">{lowPriority} tasks</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${totalTasks ? (lowPriority / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productivity / Placeholder Chart */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            Productivity Insight
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {completionRate > 75
                                ? "Great job! You are crushing your goals."
                                : completionRate > 40
                                    ? "Good progress, keep pushing!"
                                    : "Let's focus on clearing that backlog."}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="text-center">
                            <span className="block text-4xl mb-2">🚀</span>
                            <span className="text-slate-500 font-medium">Keep up the momentum!</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
