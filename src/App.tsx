"use client";

import { ConfigProvider } from "antd";
import type React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Header from "./components/Header";
import { AppProvider } from "./context/AppContext";

import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";

import { useState } from "react";
import "./App.css";
import { useApp } from "./AppContext";
import Footer from "./components/Footer";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminUsers from "./pages/admin/AdminUsers";

const App: React.FC = () => {
  const { isAdmin } = useApp();
  const [email, setEmail] = useState("");
  const admin = localStorage.getItem("is_admin") === "true" // check admin
  const handleSubscribe = () => {
    
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1890ff" },
      }}
    >
      <AppProvider>
        <Router>
          <div className="app-container">
            {/* Header */}
            {isAdmin ? <AdminHeader /> : <Header />}

            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders-management" element={<AdminOrders />} />
                <Route path="/admin/products-management" element={<AdminProducts />} />
                <Route path="/admin/users-management" element={<AdminUsers />} />
                <Route path="/admin/coupons-management" element={<AdminCoupons />} />
                <Route path="/login/admin" element={<AdminLoginPage />} />

              </Routes>
            </main>

          <Footer admin={false} />
          </div>
        </Router>
      </AppProvider>
    </ConfigProvider>
  );
};

export default App;
