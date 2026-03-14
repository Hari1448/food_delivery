import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { io } from 'socket.io-client';
import {
    TrendingUp, Users, DollarSign, Clock, Plus, Edit, Trash2,
    Check, X, Shield, MapPin, Bell, Utensils, ShoppingBag as BagIcon, Eye,
    Mail, Phone
} from 'lucide-react';
import API from '../api/axios';

const RestaurantDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Main', description: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, avgDelivery: '25 min' });
    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [customerFormData, setCustomerFormData] = useState({ name: '', email: '', phone: '' });
    const [editingCustomerId, setEditingCustomerId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (restaurant?._id) {
            const socket = io('http://localhost:5000');

            socket.on(`newOrder-${restaurant._id}`, (newOrder) => {
                setOrders(prev => [newOrder, ...prev]);
                setNewOrderAlert(newOrder);
                // Sound notification (optional)
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                    audio.play();
                } catch (e) { }

                setTimeout(() => setNewOrderAlert(null), 5000);
                
                // Refresh all data to update stats
                fetchData();
            });

            return () => socket.disconnect();
        }
    }, [restaurant]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/restaurants/my-restaurant');
            setRestaurant(res.data.data);
            const [menuRes, orderRes, statsRes, customersRes] = await Promise.all([
                API.get(`/restaurants/${res.data.data._id}/menu`),
                API.get(`/orders/restaurant/${res.data.data._id}`),
                API.get(`/restaurants/stats`),
                API.get(`/restaurants/customers`)
            ]);
            setMenuItems(menuRes.data.data);
            setOrders(orderRes.data.data);
            setStats(statsRes.data.data);
            setCustomers(customersRes.data.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', price: '', category: 'Main', description: '', image: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (item) => {
        setModalMode('edit');
        setEditingId(item._id);
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            image: item.image || ''
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await API.post(`/restaurants/${restaurant._id}/menu`, formData);
            } else {
                await API.patch(`/restaurants/menu/${editingId}`, formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving menu item:", err);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this gourmet item?")) return;
        try {
            await API.delete(`/restaurants/menu/${itemId}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await API.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleOpenEditCustomerModal = (customer) => {
        setEditingCustomerId(customer._id);
        setCustomerFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        });
        setShowCustomerModal(true);
    };

    const handleCustomerFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.patch(`/restaurants/customers/${editingCustomerId}`, customerFormData);
            setShowCustomerModal(false);
            fetchData();
        } catch (err) {
            console.error("Error updating customer:", err);
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await API.delete(`/restaurants/customers/${customerId}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    // --- Sub-Components ---

    const AnalyticsContent = () => {
        const statsDisplay = [
            { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <DollarSign className="text-green-600" />, trend: '+12.5%' },
            { label: 'Total Orders', value: stats.orders, icon: <TrendingUp className="text-blue-600" />, trend: '+8%' },
            { label: 'Active Customers', value: stats.customers, icon: <Users className="text-purple-600" />, trend: '+15%' },
            { label: 'Avg. Delivery', value: stats.avgDelivery, icon: <Clock className="text-orange-600" />, trend: '-2 min' },
        ];

        const recentOrders = orders.slice(0, 5); // Show first 5 real orders

        return (
            <div className="space-y-8 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 font-medium italic">Welcome back, {restaurant?.name || 'Chef'}! Here's what's happening today.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsDisplay.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-2xl">{stat.icon}</div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-outfit font-black text-secondary">{stat.value}</h3>
                        </div>
                    ))}
                </div>
                {/* Recent Orders Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-outfit font-black text-lg text-secondary uppercase tracking-tight">Recent Live Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-primary text-xs font-bold uppercase hover:underline">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
                                    <th className="px-6 py-5">Order ID</th>
                                    <th className="px-6 py-5">Customer</th>
                                    <th className="px-6 py-5">Items</th>
                                    <th className="px-6 py-5">Total</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order, idx) => (
                                    <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-secondary">#ORD-{order._id.slice(-4).toUpperCase()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">{order.user?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{order.items.length} items</td>
                                        <td className="px-6 py-4 text-sm font-black text-primary">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className="text-[10px] bg-gray-50 border-none font-black uppercase tracking-widest text-primary focus:ring-0 cursor-pointer"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const OrdersContent = () => (
        <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">Order Management</h1>
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <BagIcon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">No orders yet</h3>
                    <p className="text-gray-400 text-sm">Your restaurant is online. New orders will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
                                <th className="px-8 py-6">Order ID</th>
                                <th className="px-8 py-6">Customer</th>
                                <th className="px-8 py-6">Items</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-secondary text-sm">#ORD-{order._id.slice(-4).toUpperCase()}</td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-secondary text-sm">{order.user?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{order.user?.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1">
                                            {order.items.map((item, id) => (
                                                <span key={id} className="text-[10px] bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-500">
                                                    {item.quantity}x {item.foodItem?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-primary text-sm">₹{order.totalAmount}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <select
                                            className="text-[10px] bg-gray-50 border-none font-black uppercase tracking-widest text-primary focus:ring-0 cursor-pointer text-right"
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        >
                                            <option value="pending">Mark Pending</option>
                                            <option value="preparing">Mark Preparing</option>
                                            <option value="delivered">Mark Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const CustomersContent = () => (
        <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">User Matrix</h1>
            {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">No customers yet</h3>
                    <p className="text-gray-400 text-sm">Customers who order from you will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
                                <th className="px-8 py-6">User Details</th>
                                <th className="px-8 py-6">Contact Info</th>
                                <th className="px-8 py-6">Role</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center font-bold">
                                                {customer.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-secondary">{customer.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Joined: {new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                <Mail size={12} className="text-gray-300" />
                                                <span>{customer.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                <Phone size={12} className="text-gray-300" />
                                                <span>{customer.phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {customer.role === 'admin' && (
                                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                ADMIN
                                            </span>
                                        )}
                                        {customer.role === 'restaurant_owner' && (
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                RESTAURANT OWNER
                                            </span>
                                        )}
                                        {customer.role === 'customer' && (
                                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                CUSTOMER
                                            </span>
                                        )}
                                        {customer.role === 'delivery_partner' && (
                                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                RIDER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenEditCustomerModal(customer)}
                                                className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer._id)}
                                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const MenuContent = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">Virtual Menu</h1>
                    <p className="text-gray-400 font-medium italic">Manage your gourmet offerings.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="btn-pill"
                >
                    <Plus size={18} />
                    <span>ADD ITEM</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {menuItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                            <img src={item.image || 'https://via.placeholder.com/400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <button
                                    onClick={() => handleOpenEditModal(item)}
                                    className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-lg hover:scale-110 active:scale-95"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item._id)}
                                    className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-lg hover:scale-110 active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-outfit font-black text-secondary uppercase tracking-tight">{item.name}</h3>
                                <span className="text-primary font-black text-sm">₹{item.price}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium line-clamp-2 mb-4 italic">{item.description}</p>
                            <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-full tracking-widest">{item.category}</span>
                        </div>
                    </div>
                ))}
                {menuItems.length === 0 && !loading && (
                    <div className="col-span-full py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                        <Utensils size={40} className="mb-4" />
                        <p className="font-bold">No menu items found. Start adding some!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const SettingsContent = () => {
        const [isOpen, setIsOpen] = useState(restaurant?.isOpen ?? true);
        const [storeName, setStoreName] = useState(restaurant?.name || "");
        const [isSaving, setIsSaving] = useState(false);
        const [showSuccess, setShowSuccess] = useState(false);

        const handleSave = async () => {
            setIsSaving(true);
            try {
                await API.patch('/restaurants/my-restaurant', { name: storeName, isOpen });
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                fetchData();
            } catch (err) {
                console.error("Error saving settings:", err);
            } finally {
                setIsSaving(false);
            }
        };

        return (
            <div className="max-w-4xl space-y-8 animate-slide-up pb-10 relative">
                {showSuccess && (
                    <div className="fixed top-10 right-10 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce flex items-center space-x-2">
                        <Check size={20} />
                        <span className="font-bold">Settings Saved Successfully!</span>
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight">Store Settings</h1>
                    <p className="text-gray-400 font-medium italic">Configure your outlet and preferences below.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Restaurant Name</label>
                            <div className="relative">
                                <Utensils className="absolute left-4 top-4 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="input-field !pl-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                                <input type="text" className="input-field !pl-12" defaultValue="123 Gourmet St, Foodville" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Availability</label>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-secondary">Accepting Orders</p>
                                    <p className="text-[10px] text-gray-400">{isOpen ? "Your restaurant is online" : "Your restaurant is offline"}</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isOpen ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isOpen ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Alerts</label>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex-1 text-xs font-bold text-secondary">New Order Sound</div>
                                <Bell className="text-primary" size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`btn-primary !py-4 px-10 shadow-lg shadow-primary/20 flex items-center space-x-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>SAVING...</span>
                                </>
                            ) : (
                                <span>SAVE CHANGES</span>
                            )}
                        </button>
                        <button className="px-8 py-4 bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-colors">Discard</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <DashboardLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="Restaurant Owner"
            restaurantName={restaurant?.name}
        >
            {newOrderAlert && (
                <div className="fixed top-24 right-8 z-[100] animate-bounce">
                    <div className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl flex items-center space-x-4 border-4 border-white">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Bell className="animate-swing" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">New Order Alert!</p>
                            <p className="font-outfit font-black text-lg">Value: ₹{newOrderAlert.totalAmount}</p>
                            <p className="text-xs font-bold italic opacity-60">Just placed by {newOrderAlert.user?.name || 'Customer'}</p>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'analytics' && <AnalyticsContent />}
            {activeTab === 'customers' && <CustomersContent />}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'menu' && <MenuContent />}
            {activeTab === 'settings' && <SettingsContent />}

            {/* Modal for Add/Edit Item */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-outfit font-black text-secondary tracking-tight uppercase">
                                {modalMode === 'add' ? 'New Menu Item' : 'Edit Menu Item'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={28} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                                <input
                                    type="text" required
                                    className="input-field"
                                    placeholder="e.g. Truffle Burger"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="input-field"
                                        placeholder="299"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        className="input-field appearance-none bg-gray-50"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Main</option>
                                        <option>Starter</option>
                                        <option>Drink</option>
                                        <option>Dessert</option>
                                        <option>Burger</option>
                                        <option>Pizza</option>
                                        <option>Sushi</option>
                                        <option>Tacos</option>
                                        <option>Salad</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dish Image URL</label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        className="input-field pr-12"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                    {formData.image && (
                                        <div className="absolute right-3 top-3 w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                            <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1 italic">Provide a high-quality URL for your dish.</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    className="input-field !h-28 py-4 resize-none"
                                    placeholder="Describe your delicious dish..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full btn-primary !py-5 mt-4 flex items-center justify-center space-x-2">
                                <Check size={20} />
                                <span>{modalMode === 'add' ? 'PUBLISH TO MENU' : 'UPDATE MENU ITEM'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal for Edit Customer */}
            {showCustomerModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-outfit font-black text-secondary tracking-tight uppercase">Edit User</h2>
                            <button onClick={() => setShowCustomerModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={28} /></button>
                        </div>
                        <form onSubmit={handleCustomerFormSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                                <input
                                    type="text" required
                                    className="input-field"
                                    value={customerFormData.name}
                                    onChange={e => setCustomerFormData({ ...customerFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email" required
                                    className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
                                    value={customerFormData.email}
                                    readOnly
                                />
                                <p className="text-[10px] text-gray-400 ml-1 italic">Email cannot be changed.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                                <input
                                    type="text" required
                                    className="input-field"
                                    value={customerFormData.phone}
                                    onChange={e => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary !py-5 mt-4 flex items-center justify-center space-x-2">
                                <Check size={20} />
                                <span>UPDATE USER</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default RestaurantDashboard;
