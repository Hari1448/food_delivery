import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Clock, ArrowLeft, Heart, Search, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const RestaurantMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [resDetails, resMenu] = await Promise.all([
                    API.get(`/restaurants`), // Need a single restaurant get route ideally, but will filter for now or look for one
                    API.get(`/restaurants/${id}/menu`)
                ]);
                const found = resDetails.data.data.find(r => r._id === id);
                setRestaurant(found);
                setMenu(resMenu.data.data);
                setFilteredMenu(resMenu.data.data);
            } catch (err) {
                console.error("Failed to fetch menu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredMenu(menu);
        } else {
            setFilteredMenu(menu.filter(item => item.category === activeCategory));
        }
    }, [activeCategory, menu]);

    const categories = ['All', ...new Set(menu.map(item => item.category))];

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    if (!restaurant) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Navbar />
            <h1 className="text-2xl font-bold text-secondary mb-4">Gourmet Haven Missing</h1>
            <p className="text-gray-400 mb-8">This restaurant seems to have closed its virtual doors.</p>
            <button onClick={() => navigate('/')} className="btn-primary">Back to Explore</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />

            {/* Header Info */}
            <div className="pt-24 pb-8 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-6 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Explore</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start space-x-6">
                            <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-xl shadow-orange-100 border-4 border-white">
                                <img src={restaurant?.images[0] || 'https://via.placeholder.com/400'} alt={restaurant?.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-outfit font-black text-secondary tracking-tight uppercase mb-2">{restaurant?.name}</h1>
                                <p className="text-gray-400 font-medium italic mb-4 max-w-md">{restaurant?.description}</p>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-sm font-black text-secondary">{restaurant?.rating}</span>
                                        <span className="text-[10px] text-gray-400 font-bold">({restaurant?.numReviews}+)</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-400 text-sm font-bold uppercase tracking-wider">
                                        <Clock size={16} />
                                        <span>{restaurant?.deliveryTime} mins</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-400 text-sm font-bold uppercase tracking-wider">
                                        <Filter size={16} />
                                        <span>{restaurant?.cuisine?.join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center space-x-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 px-6 py-3 rounded-2xl transition-all border border-gray-100 group">
                            <Heart size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm">Add to Favorites</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Categories Sidebar */}
                    <div className="md:w-64 shrink-0">
                        <div className="sticky top-32 space-y-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Categories</h3>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'hover:bg-white text-gray-500 hover:text-primary'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="flex-1 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-outfit font-black text-secondary tracking-tight uppercase">{activeCategory} Items</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search in menu..."
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm italic outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {filteredMenu.map((item) => (
                                <div key={item._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-6 hover:shadow-xl transition-all duration-500 group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                        <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-outfit font-black text-secondary uppercase tracking-tight">{item.name}</h4>
                                            <span className="text-primary font-black text-sm">₹{item.price}</span>
                                        </div>

                                        <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 italic">{item.description}</p>
                                        <button
                                            onClick={() => dispatch(addToCart({ id: item._id, name: item.name, price: item.price, restaurant: restaurant.name, restaurantId: restaurant._id, image: item.image }))}
                                            className="w-full py-2 bg-gray-50 hover:bg-primary text-secondary hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center space-x-2"
                                        >
                                            <ShoppingBag size={14} />
                                            <span>Add to Basket</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredMenu.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-300 italic">No items found in this category.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;
