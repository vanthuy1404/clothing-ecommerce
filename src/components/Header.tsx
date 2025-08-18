"use client"
import { Button, Dropdown, Avatar, type MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Header: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Fetch cart count
  const fetchCartCount = useCallback(async (userId: string) => {
    try {
      const res = await axios.get(`https://localhost:7209/api/Cart/${userId}`);
      setCartCount(res.data.length);
    } catch {
      setCartCount(0);
    }
  }, []); // Bỏ setCartCount khỏi dependency vì nó stable

  // Khi user thay đổi (login/logout) → fetch cart
  useEffect(() => {
    if (user) {
      fetchCartCount(user.id);
    } else {
      setCartCount(0);
    }
  }, [user, fetchCartCount]);

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setCartCount(0); // Reset cart count khi logout
    navigate("/");
  };

  // Handle cart click - điều hướng đến trang cart
  const handleCartClick = () => {
    if (user) {
      navigate("/cart"); // Thay đổi route theo ứng dụng của bạn
    } else {
      // Có thể hiển thị thông báo hoặc điều hướng đến login
      navigate("/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "/account", label: "Tài khoản" },
    { key: "/orders", label: "Đơn hàng" },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất" },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(key);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate("/")}>
          Fashion Store
        </div>
        
        <nav className="nav-menu">
          <div 
            className={`nav-item ${currentPath === "/" ? "active" : ""}`} 
            onClick={() => navigate("/")}
          >
            Trang chủ
          </div>
          <div 
            className={`nav-item ${currentPath === "/products" ? "active" : ""}`} 
            onClick={() => navigate("/products")}
          >
            Sản phẩm
          </div>
        </nav>

        <div className="user-actions">
          <div 
            className="cart-icon" 
            onClick={handleCartClick}
            style={{ cursor: "pointer" }}
          >
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          {user ? (
            <Dropdown 
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
              placement="bottomRight"
            >
              <div style={{ 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px" 
              }}>
                <Avatar size="small">👤</Avatar>
                <span>{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button size="small" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button type="primary" size="small" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;