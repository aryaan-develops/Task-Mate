
import React from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    Inbox,
    Activity,
    Archive,
    PieChart,
    Users,
    Search,
    Bell,
    Menu,
    ChevronDown,
    LogOut,
    LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`
            fixed md:static inset-y-0 left-0 z-50
            w-64 bg-white h-screen p-6 flex flex-col border-r border-slate-100 font-sans
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Top Icons */}
            <div className="flex gap-4 mb-10 text-slate-400 items-center">
                <Menu className="w-5 h-5 cursor-pointer hover:text-slate-600" />
                <Search className="w-5 h-5 cursor-pointer hover:text-slate-600" />
                <Bell className="w-5 h-5 cursor-pointer hover:text-slate-600" />
                <div className="ml-auto">
                    {user ? (
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors" title="Login">
                            <LogIn className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-8">
                {/* Project Section */}


                {/* Tasks Section (Active) */}
                <div>
                    <h3 className="flex items-center gap-3 text-slate-800 font-bold mb-4 cursor-pointer">
                        <div className="w-1 h-4 bg-orange-400 rounded-full mr-[-4px]"></div>
                        <ListTodo className="w-5 h-5 text-orange-400" />
                        Task
                    </h3>

                    <div className="pl-9 space-y-4">
                        <Link to="/priority" className="flex justify-between items-center text-slate-400 text-sm cursor-pointer hover:text-slate-600">
                            <span>Priority</span>
                            <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full text-xs font-bold">13</span>
                        </Link>

                        <div className="relative">
                            <div className="absolute -left-9 w-1 h-8 bg-purple-500 rounded-r-lg top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                            <Link to="/" className="flex justify-between items-center text-slate-700 font-medium bg-gradient-to-r from-purple-50 to-transparent p-2 -ml-2 rounded-lg cursor-pointer">
                                <span>Board</span>
                            </Link>
                        </div>


                    </div>
                </div>



                {/* Analytics */}
                <div>
                    <h3 className="flex items-center gap-3 text-slate-500 font-medium mb-4 cursor-pointer hover:text-slate-700">
                        <PieChart className="w-5 h-5" />
                        <Link to="/analytics">Analytics</Link>
                    </h3>
                </div>

                <div>
                    <h3 className="flex items-center gap-3 text-slate-500 font-medium mb-4 cursor-pointer hover:text-slate-700">
                        <Activity className="w-5 h-5" />
                        <Link to="/your-tasks">Your Tasks</Link>
                    </h3>
                </div>

                {user?.role === 'admin' && (
                    <div>
                        <h3 className="flex items-center gap-3 text-slate-500 font-medium mb-4 cursor-pointer hover:text-slate-700">
                            <ListTodo className="w-5 h-5" />
                            <Link to="/assign-task">Assign Task</Link>
                        </h3>
                    </div>
                )}
            </div>

            {/* Members */}
            <div className="mt-auto">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Members</h3>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-slate-500 hover:text-slate-500">
                        +
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
