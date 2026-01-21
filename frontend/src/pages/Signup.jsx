
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await register(name, email, password, role);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center p-4 sm:p-8">
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex min-h-[600px] flex-row-reverse">

                {/* Right Side (now Left visually in code structure, but standard right in flex-row-reverse) - Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-2">TaskMaster</h2>
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">Create Account</h1>
                        <p className="text-slate-400">Join us today! Enter your details below.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-600 text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-600 text-sm font-semibold mb-2">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-600 text-sm font-semibold mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-4 text-center transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Get Started'}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-400">
                                Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Log in</Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Left Side (visually Right) - Illustration */}
                <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-center items-center relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

                    <div className="relative z-10 w-full max-w-md">
                        <img src="/assets/collaboration.png" alt="Signup Illustration" className="w-full h-auto drop-shadow-2xl rounded-2xl" />
                    </div>

                    <div className="relative z-10 mt-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-blue-100 opacity-80">Experience the future of task management. Sign up today and start organizing your life.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
