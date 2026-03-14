import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../store/cartSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <span className="text-2xl font-outfit font-bold tracking-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                            Hari's Kitchen
                        </span>
                    </div>

                    {/* Desktop Search & Location */}
                    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <MapPin size={18} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                placeholder="Deliver to New York..."
                            />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex space-x-4">
                            <button onClick={() => {
                                if (window.location.pathname === '/') {
                                    document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    navigate('/');
                                    setTimeout(() => document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                }
                            }} className="nav-link bg-transparent border-none">Restaurants</button>
                            <button onClick={() => {
                                if (window.location.pathname === '/') {
                                    document.getElementById('menus-section')?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    navigate('/');
                                    setTimeout(() => document.getElementById('menus-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                }
                            }} className="nav-link bg-transparent border-none">Menus</button>
                            <button onClick={() => navigate('/category/Pizza')} className="nav-link bg-transparent border-none">Offers</button>
                            <button onClick={() => {
                                const btn = document.querySelector('.chatbot-trigger');
                                if (btn) btn.click();
                            }} className="nav-link bg-transparent border-none">Support</button>
                        </div>

                        <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                            <button
                                onClick={() => dispatch(toggleCart())}
                                className="p-2 text-gray-500 hover:text-primary transition-colors relative"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <div
                                        onClick={() => {
                                            if (user.role === 'admin') navigate('/admin/dashboard');
                                            else if (user.role === 'restaurant_owner') navigate('/restaurant/dashboard');
                                            else navigate('/orders');
                                        }}
                                        className="flex items-center space-x-2 cursor-pointer group"
                                    >

                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                            {user.name[0]}
                                        </div>
                                        <span className="text-sm font-bold text-secondary">{user.name.split(' ')[0]}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center space-x-2 btn-primary !py-1.5 !px-5 text-sm"
                                >
                                    <User size={18} />
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={() => dispatch(toggleCart())}
                            className="p-2 text-gray-500 relative"
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 hover:text-primary transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-slide-up">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <div className="relative mb-4">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm"
                                placeholder="Set location"
                            />
                        </div>
                        <button onClick={() => {
                            if (window.location.pathname === '/') {
                                document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigate('/');
                            }
                            setIsOpen(false);
                        }} className="block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Browse Restaurants</button>
                        <button onClick={() => {
                            if (window.location.pathname === '/') {
                                document.getElementById('menus-section')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigate('/');
                            }
                            setIsOpen(false);
                        }} className="block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Menus</button>
                        <button onClick={() => { navigate('/category/Pizza'); setIsOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Active Offers</button>
                        <button onClick={() => {
                            const btn = document.querySelector('.chatbot-trigger');
                            if (btn) btn.click();
                            setIsOpen(false);
                        }} className="block w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Need Help?</button>
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {isAuthenticated ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            if (user.role === 'admin') navigate('/admin/dashboard');
                                            else if (user.role === 'restaurant_owner') navigate('/restaurant/dashboard');
                                            else navigate('/');
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-center py-3 text-secondary font-bold"
                                    >
                                        My Dashboard
                                    </button>

                                    <button onClick={handleLogout} className="w-full btn-primary !bg-gray-100 !text-gray-500 !shadow-none">Logout</button>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="w-full btn-primary">Login / Sign Up</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
