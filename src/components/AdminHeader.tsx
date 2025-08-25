import { Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [activePath, setActivePath] = useState(currentPath);

  useEffect(() => {
    setActivePath(currentPath);
  }, [currentPath]);

  const handleLogout = () => {
    localStorage.removeItem("is_admin");
    localStorage.removeItem("admin");
    navigate("/login/admin");
  };

  return (
    <header className="header" style={{ background: "#f0f2f5", padding: "16px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Menu chính */}
        <div style={{ display: "flex", gap: "24px" }}>
          <div 
            style={{ cursor: "pointer", fontWeight: activePath === "/admin" ? "bold" : "normal" }}
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </div>
          <div 
            style={{ cursor: "pointer", fontWeight: activePath === "/admin/products-management" ? "bold" : "normal" }}
            onClick={() => navigate("/admin/products-management")}
          >
            Sản phẩm
          </div>
          <div 
            style={{ cursor: "pointer", fontWeight: activePath === "/admin/orders-management" ? "bold" : "normal" }}
            onClick={() => navigate("/admin/orders-management")}
          >
            Đơn hàng
          </div>
        </div>

        {/* Nút logout */}
        <Button type="primary" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
