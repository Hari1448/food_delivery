import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem('cart_items')) || [];

const initialState = {
    items: savedCart,
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.isOpen = true;
            localStorage.setItem('cart_items', JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('cart_items', JSON.stringify(state.items));
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = Math.max(1, quantity);
            }
            localStorage.setItem('cart_items', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart_items');
        }
    },
});

export const { toggleCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
