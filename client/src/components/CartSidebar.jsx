import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleCart, removeFromCart, updateQuantity } from '../store/cartSlice';

import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, isOpen } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 40.00 : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
            dispatch(toggleCart());
        } else {
            navigate('/checkout');
            dispatch(toggleCart());
        }
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(toggleCart())}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[101]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[102] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <ShoppingBag className="text-primary" size={24} />
                                <h2 className="text-xl font-outfit font-bold text-secondary">Your Basket</h2>
                                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">
                                    {items.length} Items
                                </span>
                            </div>
                            <button
                                onClick={() => dispatch(toggleCart())}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-secondary">Your basket is empty</h3>
                                        <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
                                    </div>
                                    <button
                                        onClick={() => dispatch(toggleCart())}
                                        className="btn-primary !py-2 !px-6"
                                    >
                                        Browse Restaurants
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex space-x-4">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-outfit font-bold text-secondary text-sm">{item.name}</h4>
                                                    <p className="text-xs text-gray-400 capitalize">{item.restaurant}</p>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-500"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-3 text-xs font-bold text-secondary">{item.quantity}</span>
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-500"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-secondary text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Summary */}
                        {items.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                                <div className="space-y-2 text-sm font-medium">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-secondary tracking-tight font-bold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span className="text-secondary tracking-tight font-bold">₹{deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-lg font-outfit font-black text-secondary uppercase">Total</span>
                                        <span className="text-lg font-outfit font-black text-primary">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary !py-4 flex items-center justify-center space-x-2"
                                >
                                    <span>{isAuthenticated ? 'Proceed to Pay' : 'Login to Checkout'}</span>

                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
