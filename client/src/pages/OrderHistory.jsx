import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ShoppingBag, Clock, CheckCircle, Package, ArrowRight, Bell } from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdate, setStatusUpdate] = useState(null);
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get('/orders/my-orders');
                setOrders(res.data.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (user?._id) {
            const socket = io('http://localhost:5000');

            socket.on(`orderStatusUpdate-${user._id}`, (updatedOrder) => {
                setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
                setStatusUpdate(updatedOrder);

                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                    audio.play();
                } catch (e) { }

                setTimeout(() => setStatusUpdate(null), 8000);
            });

            return () => socket.disconnect();
        }
    }, [user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />
            <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-outfit font-black text-secondary uppercase tracking-tight">Order History</h1>
                    <p className="text-gray-400 font-medium italic">Track and reorder your favorite meals.</p>
                </div>

                {statusUpdate && (
                    <div className="fixed top-24 right-8 z-[100] animate-bounce">
                        <div className="bg-secondary text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center space-x-4 border-4 border-primary">
                            <div className="bg-primary p-3 rounded-2xl">
                                <Bell className="animate-swing" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Live Status Update!</p>
                                <p className="font-outfit font-black text-lg uppercase tracking-tight">Order {statusUpdate.status}</p>
                                <p className="text-xs font-bold italic opacity-60">From {statusUpdate.restaurant?.name || 'Restaurant'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                        <h2 className="text-2xl font-bold text-secondary mb-4">No orders yet</h2>
                        <p className="text-gray-400 mb-8">Hungry? Start exploring the best restaurants around you.</p>
                        <button onClick={() => navigate('/')} className="btn-primary">Browse Restaurants</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                            <img src={order.restaurant?.images?.[0] || 'https://via.placeholder.com/200'} alt={order.restaurant?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h3 className="text-xl font-outfit font-black text-secondary uppercase tracking-tight">{order.restaurant?.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium mb-4 italic">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                        {item.quantity}x {item.foodItem?.name || 'Item'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-2xl font-black text-primary mb-4">₹{order.totalAmount}</p>
                                        <button
                                            onClick={() => navigate(`/restaurant/${order.restaurant?._id}`)}
                                            className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors group"
                                        >
                                            <span>Order Again</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
