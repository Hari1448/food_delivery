import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RestaurantDashboard from './pages/RestaurantDashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AIChatbot from './components/AIChatbot'
import CartSidebar from './components/CartSidebar'

import { useDispatch } from 'react-redux';
import { fetchMe } from './store/authSlice';

import RestaurantMenu from './pages/RestaurantMenu'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './pages/AdminDashboard'
import OrderHistory from './pages/OrderHistory'

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Future routes for Admin will go here */}
        </Routes>

        <AIChatbot />
        <CartSidebar />
      </div>
    </Router>
  )
}

export default App
