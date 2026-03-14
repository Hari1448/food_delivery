import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    Users, Utensils, DollarSign, TrendingUp, Search,
    MoreVertical, Trash2, Edit2, CheckCircle, XCircle,
    Shield, Briefcase, Mail, Phone, Info, ShoppingBag as BagIcon, Plus
} from 'lucide-react';
import API from '../api/axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, totalRestaurants: 0, totalOrders: 0, totalRevenue: 0 });
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Management State
    const [showRestModal, setShowRestModal] = useState(false);
    const [restFormData, setRestFormData] = useState({ name: '', description: '', owner: '', image: '', deliveryTime: 30 });
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedRest, setSelectedRest] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [itemFormData, setItemFormData] = useState({ name: '', price: '', category: 'Main', description: '', image: '' });
    const [editingItemId, setEditingItemId] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchRestaurants();
        fetchOrders();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const res = await API.get('/admin/restaurants');
            setRestaurants(res.data.data);
        } catch (err) {
            console.error("Error fetching restaurants:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get('/admin/orders');
            setOrders(res.data.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await API.patch(`/admin/approve-restaurant/${id}`);
            fetchRestaurants();
        } catch (err) {
            console.error("Error approving restaurant:", err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            await API.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await API.patch(`/admin/restaurants/${id}`, { isOpen: !currentStatus });
            fetchRestaurants();
        } catch (err) {
            console.error("Error toggling status:", err);
        }
    };

    const handleCreateRestaurant = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/restaurants', restFormData);
            setShowRestModal(false);
            setRestFormData({ name: '', description: '', owner: '', image: '', deliveryTime: 30 });
            fetchRestaurants();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create restaurant");
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (!window.confirm("Delete this restaurant?")) return;
        try {
            await API.delete(`/admin/restaurants/${id}`);
            fetchRestaurants();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleViewMenu = async (restaurant) => {
        setSelectedRest(restaurant);
        try {
            const res = await API.get(`/restaurants/${restaurant._id}/menu`);
            setMenuItems(res.data.data);
            setShowMenuModal(true);
        } catch (err) {
            console.error("Failed to fetch menu:", err);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            if (editingItemId) {
                await API.patch(`/restaurants/menu/${editingItemId}`, itemFormData);
            } else {
                await API.post(`/restaurants/${selectedRest._id}/menu`, itemFormData);
            }
            setShowItemModal(false);
            setEditingItemId(null);
            setItemFormData({ name: '', price: '', category: 'Main', description: '', image: '' });
            handleViewMenu(selectedRest); // Refresh menu
        } catch (err) {
            console.error("Save item failed:", err);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await API.delete(`/restaurants/menu/${itemId}`);
            handleViewMenu(selectedRest);
        } catch (err) {
            console.error("Delete item failed:", err);
        }
    };

    // --- Sub components ---

    const OverviewContent = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign />} trend="+24%" color="bg-green-500" onClick={() => setActiveTab('overview')} />
                <StatCard label="Active Users" value={stats.totalUsers} icon={<Users />} trend="+12%" color="bg-blue-500" />
                <StatCard label="Restaurants" value={stats.totalRestaurants} icon={<Utensils />} trend="+3" color="bg-purple-500" onClick={() => setActiveTab('restaurants')} />
                <StatCard label="Total Orders" value={stats.totalOrders} icon={<TrendingUp />} trend="+18%" color="bg-orange-500" onClick={() => setActiveTab('orders')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-outfit font-black text-secondary uppercase mb-6 flex items-center">
                        <CheckCircle size={20} className="mr-2 text-green-500" />
                        Pending Approvals
                    </h3>
                    <div className="space-y-4">
                        {restaurants.filter(r => !r.isOpen).length === 0 ? (
                            <div className="py-10 text-center text-gray-300 italic text-sm">No pending approvals at the moment.</div>
                        ) : (
                            restaurants.filter(r => !r.isOpen).slice(0, 5).map(r => (
                                <div key={r._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-gray-400">
                                            {r.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-secondary">{r.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{r.owner?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleApprove(r._id)}
                                        className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary-dark transition-colors"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-outfit font-black text-secondary uppercase mb-6 flex items-center">
                        <Users size={20} className="mr-2 text-blue-500" />
                        Newest Members
                    </h3>
                    <div className="space-y-4">
                        {users.slice(-5).reverse().map(u => (
                            <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold border border-gray-100">
                                        {u.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-secondary">{u.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{u.role}</p>
                                    </div>
                                </div>
                                <Info size={16} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const UserManagement = () => (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-2xl font-outfit font-black text-secondary uppercase">All Platform Users</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            <th className="px-8 py-6">User Details</th>
                            <th className="px-8 py-6">Contact Info</th>
                            <th className="px-8 py-6">Role</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                            <tr key={u._id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center font-bold">
                                            {u.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-secondary">{u.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Joined: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <Mail size={12} className="text-gray-300" />
                                            <span>{u.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <Phone size={12} className="text-gray-300" />
                                            <span>{u.phone || 'No phone'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                        u.role === 'restaurant_owner' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
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
        </div>
    );

    const RestaurantManagement = () => (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-2xl font-outfit font-black text-secondary uppercase">Restaurant Partners</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowRestModal(true)}
                        className="btn-primary !py-2 !px-4 flex items-center space-x-2"
                    >
                        <Plus size={16} />
                        <span className="text-[10px] font-black uppercase">Add Restaurant</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                {restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                    <div key={r._id} className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-2 h-full ${r.isOpen ? 'bg-green-500' : 'bg-red-400'}`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-xl text-gray-400">
                                {r.name[0]}
                            </div>
                            <div className="flex space-x-1">
                                <button onClick={() => handleViewMenu(r)} className="p-2 hover:bg-orange-50 rounded-xl text-primary transition-colors flex items-center space-x-1">
                                    <Utensils size={14} />
                                    <span className="text-[10px] font-black uppercase">Menu</span>
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteRestaurant(r._id)} className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-outfit font-black text-secondary uppercase mb-1">{r.name}</h3>
                        <p className="text-xs text-gray-400 font-bold mb-4 flex items-center uppercase tracking-widest">
                            <Mail size={12} className="mr-2" /> {r.owner?.email}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
                                <p className={`text-sm font-bold ${r.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                                    {r.isOpen ? 'Active Market' : 'Under Review'}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleStatus(r._id, r.isOpen)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${r.isOpen ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                                    }`}
                            >
                                {r.isOpen ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const OrderManagement = () => (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-2xl font-outfit font-black text-secondary uppercase">Global Order Ledger</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            <th className="px-8 py-6">ID & Date</th>
                            <th className="px-8 py-6">Customer</th>
                            <th className="px-8 py-6">Restaurant</th>
                            <th className="px-8 py-6">Amount</th>
                            <th className="px-8 py-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.filter(o => o.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || o._id.includes(searchQuery)).map(o => (
                            <tr key={o._id} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-6">
                                    <p className="font-bold text-secondary text-sm">#ORD-{o._id.slice(-4).toUpperCase()}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-bold text-secondary text-sm">{o.user?.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{o.user?.email}</p>
                                </td>
                                <td className="px-8 py-6 font-bold text-secondary text-sm">{o.restaurant?.name}</td>
                                <td className="px-8 py-6 font-black text-primary text-sm">₹{o.totalAmount}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                                        o.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {o.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <DashboardLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="System Admin"
            adminMode
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-outfit font-black text-secondary tracking-tight uppercase">Platform Control Center</h1>
                        <p className="text-gray-400 font-medium italic">Full visibility across the Hari's Kitchen ecosystem.</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2">
                            <Shield className="text-primary" size={20} />
                            <span className="text-xs font-bold text-secondary uppercase">Superuser Mode Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-1 mb-8 bg-white/50 p-1.5 rounded-2xl w-fit border border-gray-100 backdrop-blur-sm sticky top-20 z-10">
                    <TabButton active={activeTab === 'overview'} label="System Stats" icon={<TrendingUp size={16} />} onClick={() => setActiveTab('overview')} />
                    <TabButton active={activeTab === 'users'} label="User Matrix" icon={<Users size={16} />} onClick={() => setActiveTab('users')} />
                    <TabButton active={activeTab === 'restaurants'} label="Restaurant Hub" icon={<Briefcase size={16} />} onClick={() => setActiveTab('restaurants')} />
                    <TabButton active={activeTab === 'orders'} label="Global Orders" icon={<BagIcon size={16} />} onClick={() => setActiveTab('orders')} />
                </div>

                {activeTab === 'overview' && <OverviewContent />}
                {activeTab === 'restaurants' && <RestaurantManagement />}
                {activeTab === 'orders' && <OrderManagement />}

                {/* --- Modals --- */}

                {/* Add/Edit Restaurant Modal */}
                {showRestModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setShowRestModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl animate-scale-in">
                            <h2 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight mb-8">Add New Partner</h2>
                            <form onSubmit={handleCreateRestaurant} className="space-y-6">
                                <div className="space-y-4">
                                    <input
                                        type="text" required placeholder="Restaurant Name"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium"
                                        value={restFormData.name} onChange={(e) => setRestFormData({ ...restFormData, name: e.target.value })}
                                    />
                                    <select
                                        required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium"
                                        value={restFormData.owner} onChange={(e) => setRestFormData({ ...restFormData, owner: e.target.value })}
                                    >
                                        <option value="">Select Owner Account</option>
                                        {users.filter(u => u.role === 'restaurant_owner').map(u => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                    <textarea
                                        placeholder="Description" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium h-32"
                                        value={restFormData.description} onChange={(e) => setRestFormData({ ...restFormData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={() => setShowRestModal(false)} className="flex-1 py-4 text-gray-400 font-bold uppercase text-xs tracking-widest">Cancel</button>
                                    <button type="submit" className="flex-[2] btn-primary !py-4 font-black uppercase text-xs tracking-widest">Onboard Restaurant</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Menu Modal */}
                {showMenuModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-secondary/90 backdrop-blur-xl" onClick={() => setShowMenuModal(false)}></div>
                        <div className="bg-white rounded-[3rem] w-full max-w-5xl h-[80vh] relative z-10 shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
                                <div>
                                    <h2 className="text-2xl font-outfit font-black text-secondary uppercase tracking-tight">{selectedRest?.name} - Menu Matrix</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manage flavors & pricing</p>
                                </div>
                                <button
                                    onClick={() => { setShowItemModal(true); setEditingItemId(null); setItemFormData({ name: '', price: '', category: 'Main', description: '', image: '' }); }}
                                    className="btn-primary !py-3 !px-6 flex items-center space-x-2"
                                >
                                    <Plus size={18} />
                                    <span className="font-black uppercase text-xs tracking-widest">New Signature Item</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {menuItems.map(item => (
                                        <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                    <Utensils className="text-gray-300" size={24} />
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingItemId(item._id);
                                                            setItemFormData({ name: item.name, price: item.price, category: item.category, description: item.description, image: item.image });
                                                            setShowItemModal(true);
                                                        }}
                                                        className="p-2 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteItem(item._id)} className="p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="font-outfit font-black text-secondary uppercase text-sm mb-1">{item.name}</h4>
                                            <p className="text-xs text-gray-400 font-medium line-clamp-2 mb-4 h-8">{item.description}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest bg-gray-50 px-3 py-1 rounded-full">{item.category}</span>
                                                <span className="text-primary font-black">₹{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-white border-t border-gray-50 text-center">
                                <button onClick={() => setShowMenuModal(false)} className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] hover:text-secondary transition-colors">Close Control Panel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Item Modal */}
                {showItemModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
                        <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" onClick={() => setShowItemModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl animate-scale-in">
                            <h2 className="text-3xl font-outfit font-black text-secondary uppercase tracking-tight mb-8">
                                {editingItemId ? 'Update Flavor' : 'New Flavor'}
                            </h2>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <input
                                    type="text" required placeholder="Item Name"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium"
                                    value={itemFormData.name} onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number" required placeholder="Price (₹)"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium"
                                        value={itemFormData.price} onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                                    />
                                    <select
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium"
                                        value={itemFormData.category} onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                                    >
                                        <option value="Main">Main</option>
                                        <option value="Sides">Sides</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Flavor Description" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 text-sm font-medium h-24"
                                    value={itemFormData.description} onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                                ></textarea>
                                <div className="flex space-x-4 pt-4">
                                    <button type="button" onClick={() => setShowItemModal(false)} className="flex-1 py-4 text-gray-400 font-bold uppercase text-xs tracking-widest">Cancel</button>
                                    <button type="submit" className="flex-[2] btn-primary !py-4 font-black uppercase text-xs tracking-widest">
                                        {editingItemId ? 'Sync Changes' : 'Add to Menu'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, icon, trend, color, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer hover:-translate-y-2"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-[4rem]`}></div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 ${color} text-white rounded-2xl shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                {trend}
            </span>
        </div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-outfit font-black text-secondary tracking-tight">{value}</h3>
    </div>
);

const TabButton = ({ active, label, icon, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all duration-300 ${active
            ? 'bg-secondary text-white shadow-xl shadow-secondary/20'
            : 'text-gray-400 hover:text-secondary hover:bg-gray-100/50'
            }`}
    >
        {icon}
        <span className="tracking-widest">{label}</span>
    </button>
);

export default AdminDashboard;
