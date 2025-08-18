"use client";

import type React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AccountPage from "./pages/AccountPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <AppProvider>
        <Router>
          <div className="app-container">
            {/* Header luôn hiển thị */}
            <Header />
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
              </Routes>
            </main>
            <footer className="footer">
              <div className="footer-content">
                <p>
                  <strong>Fashion Store</strong> - Thời trang cho mọi người
                </p>
                <p style={{ fontSize: "14px", opacity: 0.8, marginTop: "8px" }}>
                  © 2024 Fashion Store. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </AppProvider>
    </ConfigProvider>
  );
};

export default App;
