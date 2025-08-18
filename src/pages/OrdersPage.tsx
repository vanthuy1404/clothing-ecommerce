"use client";

import React, { useEffect, useState } from "react";
import { Button, Tag, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

interface ProductDTO {
  id: string;
  name: string;
  price: number;
}

interface OrderItemDTO {
  id: string;
  size: string;
  color: string;
  quantity: number;
  product: ProductDTO;
}

interface OrderDTO {
  id: string;
  total: number;
  status: string;
  address: string;
  phone: string;
  date: string;
  items: OrderItemDTO[];
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await axios.get<OrderDTO[]>(
        `https://localhost:7209/api/Order/${user.id}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      message.error("Không thể tải đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <div className="empty-title">Vui lòng đăng nhập</div>
          <div className="empty-description">
            Bạn cần đăng nhập để xem đơn hàng
          </div>
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Chưa có đơn hàng nào</div>
          <div className="empty-description">
            Hãy đặt hàng để theo dõi trạng thái đơn hàng
          </div>
          <Button type="primary" onClick={() => navigate("/products")}>
            Mua sắm ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: "24px" }}>Đơn hàng của bạn</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>Đơn hàng #{order.id}</h3>
              <p style={{ color: "#666", margin: "4px 0 0 0" }}>
                Ngày đặt: {dayjs(order.date).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Tag color="orange" style={{ marginBottom: "8px" }}>
                {order.status}
              </Tag>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#ff4d4f",
                }}
              >
                {order.total.toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Địa chỉ giao hàng:</strong> {order.address}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Số điện thoại:</strong> {order.phone}
          </div>

          <div>
            <strong>Sản phẩm:</strong>
            <div style={{ marginTop: "8px" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {item.size} | {item.color} | SL: {item.quantity} | Giá:{' '}
                      {item.product.price.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
