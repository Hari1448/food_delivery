import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Clock, ArrowLeft, Search, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/restaurants/menu-items?category=${categoryName}`);
                setItems(res.data.data);
            } catch (err) {
                console.error("Failed to fetch category items:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, [categoryName]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />

            {/* Header */}
            <div className="pt-24 pb-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Explore</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-outfit font-black text-secondary tracking-tighter uppercase mb-2">
                                {categoryName} <span className="text-primary">Selection</span>
                            </h1>
                            <p className="text-gray-400 font-medium italic">Discover the best {categoryName.toLowerCase()} varieties across town.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-orange-50 text-primary px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-orange-100 animate-pulse">
                                {items.length} Options Found
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={item.image || 'https://via.placeholder.com/400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[10px] font-black uppercase text-secondary">
                                    {item.restaurant?.name}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-outfit font-black text-secondary uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                    <span className="text-primary font-black text-lg">₹{item.price}</span>
                                </div>

                                <p className="text-xs text-gray-400 font-medium mb-6 line-clamp-2 italic">{item.description}</p>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-1">
                                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-xs font-black text-secondary">{item.restaurant?.rating || '4.5'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                        <Clock size={12} />
                                        <span>{item.restaurant?.deliveryTime || '20'} mins</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => dispatch(addToCart({ id: item._id, name: item.name, price: item.price, restaurant: item.restaurant.name, restaurantId: item.restaurant._id, image: item.image }))}
                                    className="w-full btn-primary !py-4"
                                >
                                    <ShoppingBag size={18} className="mr-2" />
                                    <span>Add to Basket</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                            <Filter size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-2">No {categoryName} found</h2>
                        <p className="text-gray-400 max-w-xs mx-auto mb-8">We couldn't find any dishes in this category right now. Try another one!</p>
                        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
