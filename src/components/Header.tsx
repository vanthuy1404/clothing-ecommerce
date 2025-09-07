import { Avatar, Badge, Button, Dropdown, type MenuProps } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const admin = localStorage.getItem("is_admin") === "true"; // check admin
  const [cartCount, setCartCount] = useState(0);
    const [coupons, setCoupons] = useState<any[]>([]);

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
  // Fetch valid coupons
  const fetchValidCoupons = useCallback(async () => {
    try {
      const res = await axios.get("https://localhost:7209/api/Coupon/valid");
      setCoupons(res.data);
    } catch {
      setCoupons([]);
    }
  }, []);

  useEffect(() => {
    if (user && !admin) {
      fetchCartCount(user.id);
    } else {
      setCartCount(0);
    }
  }, [user, admin]);
  useEffect(() => {
    fetchValidCoupons();
  }, [fetchValidCoupons]);

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
  // Menu coupon
  const couponMenu: MenuProps["items"] = coupons.map((c) => ({
  key: c.id,
  label: (
    <div
      style={{
        maxWidth: 280,
        padding: "10px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* Header: Mã coupon + phần trăm giảm */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: "green", // xanh lá cây
            fontSize: "14px",
          }}
        >
          🎟️ {c.ma_coupon}
        </span>
        <span
          style={{
            backgroundColor: "#f9f0ff",
            color: "#722ed1", // tím
            fontWeight: "bold",
            fontSize: "13px",
            padding: "2px 6px",
            borderRadius: "6px",
          }}
        >
          -{c.phan_tram}%
        </span>
      </div>

      {/* Nội dung */}
      <div
        style={{
          fontSize: "13px",
          color: "#555",
          marginBottom: "6px",
        }}
      >
        {c.noi_dung}
      </div>

      {/* Ngày hiệu lực */}
      <small
        style={{
          display: "block",
          fontSize: "12px",
          color: "#999",
        }}
      >
        Hiệu lực:{" từ "}
        {dayjs(c.ngay_bat_dau).format("DD/MM/YYYY")} đến {dayjs(c.ngay_ket_thuc).format("DD/MM/YYYY")}

      </small>
    </div>
  ),
}));


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
            <div
              className={`nav-item ${
                currentPath === "/admin/users-management" ? "active" : ""
              }`}
              onClick={() => navigate("/admin/users-management")}
            >
              Người dùng            
            </div>
            <div
              className={`nav-item ${
                currentPath === "/admin/coupons-management" ? "active" : ""
              }`}
              onClick={() => navigate("/admin/coupons-management")}
            >
              Mã giảm giá            
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
                currentPath === "/products" ? "active" : ""
              }`}
              onClick={() => navigate("/products")}
            >
              Sản phẩm
            </div>
          </nav>
        )}

        <div className="user-actions">
          {!admin && (
            <>
              {/* Cart */}
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

              {/* Notifications */}
              <Dropdown
                menu={{ items: couponMenu }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Badge count={coupons.length} offset={[0, 6]}>
                  <div style={{ cursor: "pointer", fontSize: "18px", marginRight: "10px" }}>🔔</div>
                </Badge>
              </Dropdown>
            </>
            
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
