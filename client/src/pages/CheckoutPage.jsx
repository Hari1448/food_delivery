import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ShoppingBag, ArrowLeft, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { clearCart } from '../store/cartSlice';

import API from '../api/axios';

const CheckoutPage = () => {
    const { items } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'
    const [isProcessing, setIsProcessing] = useState(false);
    const [address, setAddress] = useState({ street: '', city: 'Mumbai', zipCode: '400001' });

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 40.00;
    const taxes = subtotal * 0.05;
    const finalTotal = subtotal + deliveryFee + taxes;

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            // Group by restaurant (though we assume cart is from one or we handle it per order)
            // For simplicity, we take the first item's restaurant ID
            // In a better version, we'd handle multi-restaurant orders or restrict cart to one restaurant

            const orderData = {
                restaurant: items[0].restaurantId, // We need to ensure restaurantId is in the item object
                items: items.map(item => ({
                    foodItem: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: finalTotal,
                deliveryAddress: address
            };

            await API.post('/orders', orderData);

            setIsProcessing(false);
            setStep(3);
            dispatch(clearCart());
        } catch (err) {
            console.error("Order failed:", err);
            alert("Something went wrong with your order. Please try again.");
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Navbar />
                <div className="text-center p-8 bg-white rounded-[3rem] shadow-xl border border-gray-100 max-w-md mx-4">
                    <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-2xl font-outfit font-black text-secondary uppercase mb-4">Your Basket is Empty</h2>
                    <p className="text-gray-400 mb-8">Add something delicious to proceed to checkout.</p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full">Browse Restaurants</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />

            <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {step < 3 && (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Process Sections */}
                        <div className="flex-1 space-y-8">
                            {/* Steps Indicator */}
                            <div className="flex items-center space-x-4 mb-10">
                                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-300'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-primary bg-orange-50' : 'border-gray-200'}`}>1</div>
                                    <span className="font-bold text-sm uppercase tracking-widest">Address</span>
                                </div>
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-300'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-primary bg-orange-50' : 'border-gray-200'}`}>2</div>
                                    <span className="font-bold text-sm uppercase tracking-widest">Payment</span>
                                </div>
                            </div>

                            {step === 1 ? (
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 animate-slide-up">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin /></div>
                                        <h2 className="text-2xl font-outfit font-black text-secondary uppercase">Delivery Address</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input type="text" className="input-field" defaultValue={user?.name} placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <input type="text" className="input-field" defaultValue={user?.phone} placeholder="+91 98765 43210" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="123 Gourmet Avenue"
                                                value={address.street}
                                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="Mumbai"
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                                <input type="text" className="input-field" placeholder="Maharashtra" />
                                            </div>
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    placeholder="400001"
                                                    value={address.zipCode}
                                                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(2)} className="w-full btn-primary !py-5 mt-10">
                                        <span>Proceed to Pay</span>
                                    </button>

                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 animate-slide-up">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CreditCard /></div>
                                            <h2 className="text-2xl font-outfit font-black text-secondary uppercase">Secure Payment</h2>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Lock size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 mb-8">
                                        {['card', 'upi', 'netbanking'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${paymentMethod === method ? 'border-primary bg-orange-50 text-primary' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-8 bg-secondary rounded-md flex items-center justify-center text-white font-bold italic">VISA</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-secondary">Visa Ending in 4242</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Expires 12/26</p>
                                                    </div>
                                                </div>
                                                <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                                                <input type="text" className="input-field" placeholder="**** **** **** 4242" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                                    <input type="text" className="input-field" placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVV</label>
                                                    <input type="password" line className="input-field" placeholder="***" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : paymentMethod === 'upi' ? (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="grid grid-cols-2 gap-4">
                                                <button className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50 hover:border-primary transition-all group">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-600 font-bold">G</div>
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary">Google Pay</span>
                                                </button>
                                                <button className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-50 hover:border-primary transition-all group">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-full mb-2 flex items-center justify-center text-purple-600 font-bold">P</div>
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary">PhonePe</span>
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">UPI ID</label>
                                                <input type="text" className="input-field" placeholder="yourname@okaxis" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map(bank => (
                                                <button key={bank} className="w-full p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-orange-50 hover:border-primary transition-all group">
                                                    <span className="text-sm font-bold text-secondary group-hover:text-primary">{bank}</span>
                                                    <ArrowLeft size={16} className="rotate-180 text-gray-300 group-hover:text-primary" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-4 mt-8">
                                        <button onClick={() => setStep(1)} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <ArrowLeft size={20} />
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={isProcessing}
                                            className="flex-1 btn-primary !py-5"
                                        >
                                            {isProcessing ? 'Processing...' : `Place Order • ₹${finalTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center space-x-2">
                                        <ShieldCheck size={14} className="text-green-500" />
                                        <span>Guaranteed Safe & Secure Checkout</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96">
                            <div className="bg-secondary text-white rounded-[2.5rem] p-8 sticky top-28 shadow-2xl shadow-secondary/20 overflow-hidden relative">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                                <h3 className="text-xl font-outfit font-black uppercase tracking-tight mb-8 relative z-10">Order Summary</h3>
                                <div className="space-y-4 mb-8 relative z-10">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold">{item.name} <span className="text-primary">x{item.quantity}</span></p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">{item.restaurant}</p>
                                            </div>
                                            <p className="text-sm font-black text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">Subtotal</span>
                                        <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">Delivery Fee</span>
                                        <span className="font-bold font-primary">₹{deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-medium">Estimated Taxes</span>
                                        <span className="font-bold">₹{taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl pt-4 border-t border-white/10 text-primary">
                                        <span className="font-outfit font-black uppercase">Total</span>
                                        <span className="font-black">₹{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-xl mx-auto py-10 animate-slide-up">
                        <div className="bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-gray-100 overflow-hidden relative">
                            {/* Confetti-like effect */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-yellow-500"></div>

                            <div className="relative mb-10">
                                <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto relative z-10 animate-bounce cursor-default">
                                    <CheckCircle size={64} strokeWidth={3} />
                                </div>
                                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-20 animate-ping"></div>
                            </div>

                            <h2 className="text-4xl font-outfit font-black text-secondary uppercase tracking-tight mb-4">Payment Successful!</h2>
                            <p className="text-gray-400 font-medium mb-10 text-lg">
                                Your order has been placed successfully and is being prepared with <span className="text-primary italic font-bold">love</span> by our chefs.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 transform hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-lg text-secondary font-black">25 - 30</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-medium">Minutes</p>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-6 text-left border border-gray-100 transform hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                    <p className="text-lg text-secondary font-black">#HK-{Math.floor(Math.random() * 90000) + 10000}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-medium underline">Copy ID</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button onClick={() => navigate('/orders')} className="w-full btn-primary !py-5 shadow-xl shadow-primary/30 flex items-center justify-center space-x-3 group">
                                    <span className="font-bold tracking-wider">TRACK MY DELIVERY</span>
                                    <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => navigate('/')} className="w-full py-5 bg-gray-50 text-gray-500 font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-gray-100 transition-all">
                                    Back to Home
                                </button>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-center space-x-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-orange-50 text-primary rounded-full flex items-center justify-center mb-2">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Preparation</span>
                                </div>
                                <div className="w-8 h-px bg-gray-200"></div>
                                <div className="flex flex-col items-center opacity-40">
                                    <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-2">
                                        <MapPin size={20} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">On the way</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
