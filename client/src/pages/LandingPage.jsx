import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, ArrowRight, Star, Clock, ShieldCheck, Zap, ShoppingBag, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import API from '../api/axios';

const LandingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        { name: 'Burger', icon: '🍔' },
        { name: 'Pizza', icon: '🍕' },
        { name: 'Sushi', icon: '🍣' },
        { name: 'Tacos', icon: '🌮' },
        { name: 'Salad', icon: '🥗' },
        { name: 'Dessert', icon: '🍰' },
    ];

    const lifestyleCategories = [
        { name: 'Gym Peoples', icon: '🏋️‍♂️', desc: 'High protein & lean meals' },
        { name: 'Old Age Peoples', icon: '👴', desc: 'Soft, nutritious & low salt' },
        { name: 'Adults', icon: '👨‍💼', desc: 'Balanced gourmet executive meals' },
        { name: 'Kids', icon: '🧒', desc: 'Fun, healthy & bite-sized treats' },
    ];

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await API.get('/restaurants');
                setRestaurants(data.data || []);
                setFilteredRestaurants(data.data || []);
            } catch (err) {
                setError("Failed to fetch gourmet restaurants. Please try again.");
                console.error("Failed to fetch restaurants:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        const results = restaurants.filter(res =>
            res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredRestaurants(results);
    }, [searchQuery, restaurants]);

    const scrollToRestaurants = () => {
        document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-16 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                        <div className="animate-slide-up">
                            <div className="inline-flex items-center space-x-2 bg-orange-50 text-primary px-4 py-2 rounded-full mb-6 border border-orange-100">
                                <Zap size={16} fill="currentColor" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Fastest Delivery in Town</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-outfit font-black text-secondary leading-tight mb-6 uppercase tracking-tighter">
                                Fresh gourmet meals <br />
                                <span className="text-primary italic">Delivered</span> to your door.
                            </h1>
                            <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
                                Order from the best local restaurants with the touch of a button. Personalized by AI, delivered with speed.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl bg-white shadow-xl shadow-gray-100 focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                                        placeholder="Search for 'Pizza' or 'Burger'..."
                                    />
                                </div>
                                <button
                                    onClick={scrollToRestaurants}
                                    className="btn-primary !px-8 !py-4 flex items-center justify-center space-x-2"
                                >
                                    <span className="font-bold tracking-wide">EXPLORE MENU</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            <div className="mt-12 flex items-center space-x-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden ring-2 ring-gray-50">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white font-bold text-xs ring-2 ring-gray-50">
                                        10k+
                                    </div>
                                </div>
                                <div>
                                    <div className="flex text-yellow-500 mb-1">
                                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">50k+ Happy Customers</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 lg:mt-0 relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-200/50 border-[12px] border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                                    alt="Delicious Food"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Cards */}
                            <div className="absolute -bottom-6 -left-10 z-20 glass-card p-4 rounded-2xl flex items-center space-x-4 animate-bounce duration-[3000ms]">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                                    <p className="font-outfit font-bold text-secondary">Quality Assured</p>
                                </div>
                            </div>

                            <div className="absolute top-10 -right-6 z-20 glass-card p-4 rounded-2xl flex items-center space-x-4 animate-pulse">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Fast</p>
                                    <p className="font-outfit font-bold text-secondary">25-30 Mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-outfit font-black text-secondary tracking-tight">POPULAR CATEGORIES</h2>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-primary font-bold hover:underline flex items-center"
                        >
                            View All <ArrowRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/category/${cat.name}`)}
                                className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300">
                                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <span className="font-outfit font-bold text-secondary group-hover:text-primary transition-colors">{cat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifestyle Menus Section */}
            <section id="menus-section" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-outfit font-black text-secondary uppercase tracking-tight">Specialty Menus</h2>
                        <p className="text-gray-400 font-medium mt-2 italic">Tailored nutrition for every lifestyle</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {lifestyleCategories.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/category/${cat.name}`)}
                                className="group cursor-pointer relative overflow-hidden p-8 rounded-[2.5rem] border border-gray-100 bg-gray-50/30 hover:bg-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
                            >
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:rotate-12 transition-transform">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-xl font-outfit font-black text-secondary group-hover:text-white mb-2 uppercase">{cat.name}</h3>
                                    <p className="text-sm text-gray-400 group-hover:text-white/80 font-medium">{cat.desc}</p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="text-white" size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Featured Restaurants */}
            <section id="restaurants-section" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">Top Rated Nearby</h2>
                            <p className="text-gray-400 mt-1 font-medium italic">
                                {searchQuery ? `Showing results for "${searchQuery}"` : "Handpicked premium dining experiences"}
                            </p>
                        </div>
                        <button className="hidden md:flex items-center space-x-2 text-primary font-bold hover:bg-orange-50 px-4 py-2 rounded-xl transition-all">
                            <span>View All</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-gray-50 animate-pulse rounded-[2rem]"></div>
                            ))
                        ) : filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((res) => (
                                <div key={res._id} className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-200/20 transition-all duration-500 hover:-translate-y-2">
                                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm">
                                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-xs font-bold text-secondary">{res.rating}</span>
                                    </div>
                                    <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                        <Heart size={20} />
                                    </button>
                                    <div
                                        onClick={() => navigate(`/restaurant/${res._id}`)}
                                        className="h-56 overflow-hidden cursor-pointer"
                                    >
                                        <img src={res.images[0] || 'https://via.placeholder.com/400'} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                onClick={() => navigate(`/restaurant/${res._id}`)}
                                                className="text-xl font-outfit font-black text-secondary group-hover:text-primary transition-colors truncate pr-4 uppercase cursor-pointer"
                                            >
                                                {res.name}
                                            </h3>
                                            <span className="text-primary font-bold text-xs bg-orange-50 px-2 py-1 rounded-lg">$$</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 divider-x">
                                            <div className="flex items-center space-x-1">
                                                <Clock size={14} />
                                                <span>{res.deliveryTime} Mins</span>
                                            </div>
                                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                            <span>Free Delivery</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/restaurant/${res._id}`)}
                                            className="w-full py-4 bg-gray-50 group-hover:bg-primary text-secondary group-hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center space-x-3"
                                        >
                                            <ShoppingBag size={18} />
                                            <span>VIEW FULL MENU</span>
                                        </button>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary italic">No restaurants found matching your search.</h3>
                                <button onClick={() => setSearchQuery('')} className="text-primary font-black uppercase text-xs mt-4 hover:underline">Clear Search</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
