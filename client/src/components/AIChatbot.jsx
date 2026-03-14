import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your Hari's Kitchen AI. Hunger calling? I can suggest restaurants or help you track an order!" }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');

        try {
            // Real API call
            const res = await API.post('/ai/recommend', { query: currentInput });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.answer
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having a bit of a brain freeze. Can you try again?"
            }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex justify-between items-center bg-gradient-to-r from-primary to-orange-600">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">Foodie AI</p>
                                    <p className="text-[10px] opacity-80">Always active</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-secondary rounded-tl-none border border-gray-100'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-trigger w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
            >

                <MessageSquare size={28} />
            </button>
        </div>
    );
};

export default AIChatbot;
