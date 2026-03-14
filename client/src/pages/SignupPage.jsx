import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const SignupPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-0 -ml-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-0 -mr-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animation-pulse"></div>

            <div className="max-w-xl w-full space-y-8 glass-card p-10 rounded-[2.5rem] relative z-10 border-white/50">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 -rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-black text-3xl">H</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-outfit font-black text-secondary uppercase tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join our community of food lovers!
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-shake">
                            {error}
                        </div>
                    )}
                </div>

                <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                            placeholder="Full Name"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                            placeholder="Email address"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <Phone size={18} />
                        </div>
                        <input
                            type="tel"
                            required
                            className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                            placeholder="Phone Number"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full pl-12 pr-12 py-4 border border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                            placeholder="Password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Register As</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['customer', 'restaurant_owner', 'delivery_partner', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role })}
                                    className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${formData.role === role
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-primary/30'
                                        }`}
                                >
                                    {role.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex items-start space-x-2 mt-2">
                        <div className="mt-1">
                            <div className="w-5 h-5 bg-green-50 text-green-600 rounded flex items-center justify-center border border-green-100">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            By creating an account, you agree to our <span className="text-secondary font-bold hover:underline cursor-pointer tracking-tight">Terms of Civil Service</span> and <span className="text-secondary font-bold hover:underline cursor-pointer tracking-tight">Privacy Policy</span>.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`md:col-span-2 group relative w-full btn-primary !py-4 flex justify-center items-center space-x-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span className="font-bold tracking-wide uppercase">{loading ? 'Creating Account...' : 'Create My Account'}</span>
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors tracking-tight">
                        Sign In instead
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
