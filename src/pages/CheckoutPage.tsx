import { Button, Card, Form, Input, message, Modal, Select } from "antd";
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
  quantity: number;
  size: string;
  color: string;
}

interface Coupon {
  id: string;
  ma_coupon: string;
  phan_tram: number;
  noi_dung: string;
}

const CheckoutPage: React.FC = () => {
  const [form] = Form.useForm();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
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

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://localhost:7209/api/Coupon/valid");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCoupons();
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

  const discountedTotal = selectedCoupon
    ? total - (total * selectedCoupon.phan_tram) / 100
    : total;

  const onFinish = async (values: { address: string; phone: string; note?: string; coupon?: string }) => {
    try {
      await axios.post("https://localhost:7209/api/Order", {
        user_id: user.id,
        address: values.address,
        phone: values.phone,
        note: values.note,
        coupon_id: selectedCoupon ? selectedCoupon.id : null,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });

      await Promise.all(
        cart.map((item) => axios.delete(`https://localhost:7209/api/Cart/${item.id}`))
      );

      Modal.success({
        title: "Đặt hàng thành công!",
        content: "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
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
        {/* Cột trái: Thông tin giao hàng */}
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
            <Form.Item name="name" label="Họ và tên">
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại">
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ giao hàng"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input.TextArea rows={3} disabled />
            </Form.Item>

            {/* Ô nhập / chọn coupon */}
            <Form.Item name="coupon" label="Mã giảm giá">
              <Select
                allowClear
                showSearch
                placeholder="Nhập hoặc chọn mã giảm giá"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as string).toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  if (!value) {
                    setSelectedCoupon(null);
                  } else {
                    const found = coupons.find((c) => c.id === value);
                    setSelectedCoupon(found || null);
                  }
                }}
              >
                {coupons.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    <span style={{ color: "green", fontWeight: 600 }}>{c.ma_coupon}</span> -{" "}
                    <span style={{ color: "purple" }}>{c.phan_tram}%</span> | {c.noi_dung}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="note" label="Ghi chú (không bắt buộc)">
              <Input.TextArea rows={2} placeholder="Ghi chú cho đơn hàng..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Đặt hàng
              </Button>
            </Form.Item>
            <div style={{ marginLeft: 20 }}>
              <i>Để thay đổi thông tin đặt hàng, vui lòng thay đổi ở trang Tài khoản của bạn</i>
            </div>
          </Form>
        </Card>

        {/* Cột phải: Tóm tắt đơn hàng */}
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

          {selectedCoupon && (
            <div className="summary-row" style={{ color: "purple" }}>
              <span>Mã giảm giá:</span>
              <span>
                {selectedCoupon.ma_coupon} (-{selectedCoupon.phan_tram}%)
              </span>
            </div>
          )}

          <div className="summary-total">
            <span>Tổng cộng:</span>
            <span style={{ color: "#ff4d4f" }}>
              {discountedTotal.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
