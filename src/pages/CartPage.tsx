;

import { Button, InputNumber, message, Spin } from "antd";
import axios from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  product_total: number;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null); // để biết item nào đang update
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`https://localhost:7209/api/Cart/${user.id}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (id: string) => {
    setUpdatingItemId(id);
    try {
      await axios.delete(`https://localhost:7209/api/Cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Error deleting item:", err);
      message.error("Không thể xóa sản phẩm");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    setUpdatingItemId(id);
    try {
      await axios.put(`https://localhost:7209/api/Cart/${id}`, { quantity });
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      message.error("Không thể cập nhật số lượng");
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (!user) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <div className="empty-title">Vui lòng đăng nhập</div>
          <div className="empty-description">Bạn cần đăng nhập để xem giỏ hàng</div>
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="main-content">Đang tải giỏ hàng...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Giỏ hàng trống</div>
          <div className="empty-description">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</div>
          <Button type="primary" style={{ backgroundColor: "#2C5F5F" }}
            onClick={() => navigate("/products")}>
            Mua sắm ngay
          </Button>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: "24px" }}>Giỏ hàng của bạn</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.product_image || "/placeholder.svg"}
                alt={item.product_name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product_name}</div>
                <div className="cart-item-details">
                  Size: {item.size} | Màu: {item.color}
                </div>
                <div className="cart-item-price">
                  {item.product_price.toLocaleString("vi-VN")}đ
                </div>

                <div className="cart-item-actions">
                  <span>Số lượng:</span>
                  <Spin spinning={updatingItemId === item.id}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleUpdateQuantity(item.id, value || 1)}
                      size="small"
                      disabled={updatingItemId === item.id}
                    />
                  </Spin>
                  <Button
                    type="text"
                    danger
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={updatingItemId === item.id}
                  >
                    Xóa
                  </Button>
                </div>

                <div style={{ marginTop: "8px", fontWeight: "bold" }}>
                  Tổng: {(item.product_price * item.quantity).toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3 style={{ marginBottom: "16px" }}>Tóm tắt đơn hàng</h3>

          <div className="summary-row">
            <span>Số lượng sản phẩm:</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>

          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>

          {/* <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div> */}

          <div className="summary-total">
            <span>Tổng cộng:</span>
            <span style={{ color: "#ff4d4f" }}>{total.toLocaleString("vi-VN")}đ</span>
          </div>

          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: "16px", backgroundColor: "#2C5F5F" }}
            onClick={() => navigate("/checkout")}
          >
            Tiến hành thanh toán
          </Button>

          <Button block style={{ marginTop: "8px" }} onClick={() => navigate("/products")}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
