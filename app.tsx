"use client"

import type React from "react"
import { useState } from "react"
import { Layout, ConfigProvider } from "antd"
import { AppProvider } from "./context/AppContext"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductsPage from "./pages/ProductsPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrdersPage from "./pages/OrdersPage"
import AccountPage from "./pages/AccountPage"

const { Content, Footer } = Layout

type PageType = "home" | "login" | "register" | "products" | "cart" | "checkout" | "orders" | "account"

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />
      case "login":
        return <LoginPage onNavigate={setCurrentPage} />
      case "register":
        return <RegisterPage onNavigate={setCurrentPage} />
      case "products":
        return <ProductsPage onNavigate={setCurrentPage} />
      case "cart":
        return <CartPage onNavigate={setCurrentPage} />
      case "checkout":
        return <CheckoutPage onNavigate={setCurrentPage} />
      case "orders":
        return <OrdersPage onNavigate={setCurrentPage} />
      case "account":
        return <AccountPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <AppProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <Content style={{ background: "#f5f5f5" }}>{renderPage()}</Content>
          <Footer style={{ textAlign: "center", background: "#001529", color: "#fff" }}>
            <div style={{ padding: "24px 0" }}>
              <div style={{ marginBottom: "16px" }}>
                <strong>Fashion Store</strong> - Thời trang cho mọi người
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>© 2024 Fashion Store. All rights reserved.</div>
              <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.6 }}>
                Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM | Hotline: 1900-123-456
              </div>
            </div>
          </Footer>
        </Layout>
      </AppProvider>
    </ConfigProvider>
  )
}

export default App
