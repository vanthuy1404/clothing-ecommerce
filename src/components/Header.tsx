import { Button, Dropdown, Avatar, type MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Header: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const admin = localStorage.getItem("is_admin") === "true"; // check admin
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
  }, []);

  useEffect(() => {
    if (user && !admin) {
      fetchCartCount(user.id);
    } else {
      setCartCount(0);
    }
  }, [user, admin, fetchCartCount]);

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("is_admin");
    setCartCount(0);
    navigate("/");
    window.location.reload(); // reload để cập nhật header
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "/account", label: "Tài khoản" },
    { key: "/orders", label: "Đơn hàng" },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất" },
  ];

  const adminMenuItems: MenuProps["items"] = [
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

        {/* Nếu là admin thì hiện Dashboard, Sản phẩm, Đơn hàng */}
        {admin ? (
          <nav className="nav-menu">
            <div
              className={`nav-item ${currentPath === "/admin" ? "active" : ""}`}
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </div>
            <div
              className={`nav-item ${
                currentPath === "/admin/products-management" ? "active" : ""
              }`}
              onClick={() => navigate("/admin/products-management")}
            >
              Sản phẩm
            </div>
            <div
              className={`nav-item ${
                currentPath === "/admin/orders-management" ? "active" : ""
              }`}
              onClick={() => navigate("/admin/orders-management")}
            >
              Đơn hàng
            </div>
          </nav>
        ) : (
          // Nếu không phải admin thì giữ menu cũ
          <nav className="nav-menu">
            <div
              className={`nav-item ${currentPath === "/" ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </div>
            <div
              className={`nav-item ${
                currentPath === "/products-management" ? "active" : ""
              }`}
              onClick={() => navigate("/products-management")}
            >
              Sản phẩm
            </div>
          </nav>
        )}

        <div className="user-actions">
          {!admin && (
            <div
              className="cart-icon"
              onClick={handleCartClick}
              style={{ cursor: "pointer" }}
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          )}

          {(user || admin) ? (
            <Dropdown
              menu={{
                items: admin ? adminMenuItems : userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Avatar size="small">👤</Avatar>
                <span>{admin ? "Admin" : user?.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button size="small" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => navigate("/register")}
              >
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
