"use client";

import { Button, ConfigProvider, Divider, Input, Space } from "antd";
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

import { EnvironmentOutlined, FacebookOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./App.css";
import { useApp } from "./AppContext";
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

            <footer
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "40px 0 20px",
          marginTop: "auto",
          display: (admin ? "none" : "block")
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left Section - Company Info & Contact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              alignItems: window.innerWidth <= 768 ? "center" : "flex-start",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  margin: "0 0 8px 0",
                  color: "#fff",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Fashion Store
              </h3>
              <p
                style={{
                  fontSize: "1.1rem",
                  margin: "0",
                  opacity: 0.9,
                  fontStyle: "italic",
                }}
              >
                Thời trang cho mọi người
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "1rem",
                  justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
                }}
              >
                <EnvironmentOutlined style={{ fontSize: "1.2rem", color: "#ffd700" }} />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "1rem",
                  justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
                }}
              >
                <PhoneOutlined style={{ fontSize: "1.2rem", color: "#ffd700" }} />
                <span>0123 456 789</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "1rem",
                  justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
                }}
              >
                <MailOutlined style={{ fontSize: "1.2rem", color: "#ffd700" }} />
                <span>info@fashionstore.com</span>
              </div>
            </div>

            <div>
              <h4
                style={{
                  color: "#fff",
                  margin: "0 0 15px 0",
                  fontSize: "1.1rem",
                }}
              >
                Theo dõi chúng tôi
              </h4>
              <Space size="large">
                <FacebookOutlined
                  style={{
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "8px",
                    borderRadius: "50%",
                  }}
                />
                <InstagramOutlined
                  style={{
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "8px",
                    borderRadius: "50%",
                  }}
                />
                <TwitterOutlined
                  style={{
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "8px",
                    borderRadius: "50%",
                  }}
                />
                <YoutubeOutlined
                  style={{
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "8px",
                    borderRadius: "50%",
                  }}
                />
              </Space>
            </div>
          </div>

          {/* Right Section - Newsletter */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "30px",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <h3
                style={{
                  color: "#fff",
                  margin: "0 0 10px 0",
                  fontSize: "1.4rem",
                  textAlign: "center",
                }}
              >
                Đăng ký nhận tin
              </h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  opacity: 0.9,
                  textAlign: "center",
                  fontSize: "0.95rem",
                }}
              >
                Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Input
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubscribe}
                  style={{
                    borderRadius: "8px",
                    background: "#ffd700",
                    borderColor: "#ffd700",
                    color: "#333",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Divider
          style={{
            borderColor: "rgba(255,255,255,0.3)",
            margin: "30px 0 20px 0",
          }}
        />

        <div
          style={{
            textAlign: "center",
            opacity: 0.8,
            fontSize: "0.9rem",
          }}
        >
          <p style={{ margin: 0 }}>© 2024 Fashion Store. All rights reserved.</p>
        </div>
      </footer>
          </div>
        </Router>
      </AppProvider>
    </ConfigProvider>
  );
};

export default App;
