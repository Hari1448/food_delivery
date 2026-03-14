import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import API from '../api/axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginRole, setLoginRole] = useState('user'); // 'user' or 'admin'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await API.post('/auth/login', { email, password });
            dispatch(setCredentials({ user: data.user, token: data.accessToken }));
            localStorage.setItem('token', data.accessToken);

            // Redirect based on role or redirect path
            if (data.user.role === 'restaurant_owner') {
                navigate('/restaurant/dashboard');
            } else if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate(redirectPath ? `/${redirectPath}` : '/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-[2.5rem] relative z-10 border-white/50">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-black text-3xl">H</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-outfit font-black text-secondary uppercase tracking-tight">
                        {loginRole === 'admin' ? 'Admin Gateway' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400 italic">
                        {loginRole === 'admin' ? 'Secure platform management portal.' : 'Hungry? Let\'s get you signed in.'}
                    </p>

                    <div className="mt-6 flex bg-gray-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setLoginRole('user')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginRole === 'user' ? 'bg-white text-secondary shadow-sm' : 'text-gray-400'}`}
                        >
                            User Login
                        </button>
                        <button
                            onClick={() => setLoginRole('admin')}
                            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginRole === 'admin' ? 'bg-secondary text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            Admin Login
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-shake">
                            {error}
                        </div>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-12 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm outline-none"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                                Remember me
                            </label>
                        </div>

                        <div className="font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer">
                            Forgot password?
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full btn-primary !py-4 flex justify-center items-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className="font-bold tracking-wide">{loading ? 'Processing...' : 'Sign In'}</span>
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors space-x-2 bg-white">
                            <Chrome size={18} className="text-red-500" />
                            <span className="text-sm font-bold text-secondary">Google</span>
                        </button>
                        <button className="flex items-center justify-center py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors space-x-2 bg-white">
                            <Github size={18} />
                            <span className="text-sm font-bold text-secondary">Github</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
                    <p className="text-sm text-gray-400 font-medium mb-4">
                        {loginRole === 'admin' ? "New administrative partner? " : "New to Hari's Kitchen? "}
                    </p>
                    <Link
                        to="/signup"
                        className="w-full text-center py-4 border-2 border-primary text-primary font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        Create My Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
