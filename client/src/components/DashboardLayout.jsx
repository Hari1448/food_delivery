import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Utensils, Settings, LogOut, BarChart3, Menu as MenuIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const DashboardLayout = ({
    children,
    role = "Restaurant Owner",
    activeTab,
    onTabChange,
    restaurantName = "Hari's Kitchen",
    adminMode = false
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const merchantMenu = [
        { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
        { id: 'customers', name: 'Users', icon: <Users size={20} /> },
        { id: 'orders', name: 'Orders', icon: <ShoppingBag size={20} /> },
        { id: 'menu', name: 'Menu Items', icon: <Utensils size={20} /> },
        { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    const adminMenu = [
        { id: 'overview', name: 'Overview', icon: <BarChart3 size={20} /> },
        { id: 'restaurants', name: 'Restaurants', icon: <Utensils size={20} /> },
    ];

    const menuItems = adminMode ? adminMenu : merchantMenu;


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`bg-secondary text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20`}>
                <div className="p-6 flex items-center space-x-3 mb-8">
                    <div className="mx-auto h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    {isSidebarOpen && <span className="font-outfit font-bold text-lg truncate tracking-tight text-gradient">Hari's Kitchen</span>}
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'hover:bg-white/10 text-gray-400'}`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                            <MenuIcon size={24} />
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 transition-all hover:bg-orange-50"
                        >
                            <LayoutDashboard size={16} className="text-primary" />
                            <span>Go Home</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-secondary uppercase tracking-tighter">{restaurantName}</p>
                            <p className="text-xs text-gray-400 font-medium italic">Premium Partner</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-primary/20 overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=12" alt="profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
