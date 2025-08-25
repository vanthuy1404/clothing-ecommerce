;

import type React from "react";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
  size: string;
  color: string;
}

const CheckoutPage: React.FC = () => {
  const [form] = Form.useForm();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (!user || cart.length === 0) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-title">Không có sản phẩm để thanh toán</div>
          <div className="empty-description">
            Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </div>
          <Button type="primary" onClick={() => navigate("/products")}>
            Mua sắm ngay
          </Button>
        </div>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );

  const onFinish = async (values: { address: string; phone: string; note?: string }) => {
    try {
      // gọi API tạo order
      await axios.post("https://localhost:7209/api/Order", {
        user_id: user.id,
        address: values.address,
        phone: values.phone,
        note: values.note,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });

      // clear giỏ hàng
      await Promise.all(
        cart.map((item) => axios.delete(`https://localhost:7209/api/Cart/${item.id}`))
      );

      Modal.success({
        title: "Đặt hàng thành công!",
        content:
          "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
        onOk: () => navigate("/orders"),
      });
    } catch (err) {
      console.error("Error creating order:", err);
      message.error("Không thể đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: "24px" }}>Thanh toán</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <Card title="Thông tin giao hàng">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: user.name,
              email: user.email,
              phone: user.phone || "",
              address: user.address || "",
            }}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              
            >
              <Input size="large" disabled ={true} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
              ]}
            >
              <Input size="large" disabled ={true}/>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input size="large" disabled ={true}/>
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea rows={3} disabled ={true}/>
            </Form.Item>

            <Form.Item name="note" label="Ghi chú (không bắt buộc)">
              <Input.TextArea rows={2} placeholder="Ghi chú cho đơn hàng..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Đặt hàng
              </Button>
            </Form.Item>
            <div style={{marginLeft:20}}><i>Để thay đổi thông tin đặt hàng, vui lòng thay đổi ở trang Tài khoản của bạn</i></div>
          </Form>
        </Card>

        <div className="order-summary">
          <h3 style={{ marginBottom: "16px" }}>Đơn hàng của bạn</h3>

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <div style={{ fontWeight: "500" }}>{item.product_name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {item.size} | {item.color} | SL: {item.quantity}
                </div>
              </div>
              <div style={{ fontWeight: "bold" }}>
                {(item.product_price * item.quantity).toLocaleString("vi-VN")}đ
              </div>
            </div>
          ))}

          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>

          <div className="summary-total">
            <span>Tổng cộng:</span>
            <span style={{ color: "#ff4d4f" }}>
              {total.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
