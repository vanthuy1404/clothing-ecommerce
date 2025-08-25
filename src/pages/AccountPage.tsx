;

import type React from "react";
import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  // Nếu chưa đăng nhập → điều hướng sang login
  if (!user) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <div className="empty-title">Vui lòng đăng nhập</div>
          <div className="empty-description">
            Bạn cần đăng nhập để xem thông tin tài khoản
          </div>
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const onFinish = async (values: any) => {
    try {
      const res = await fetch(`https://localhost:7209/api/User/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          address: values.address,
        }),
      });

      if (!res.ok) {
        throw new Error("Cập nhật thất bại!");
      }

      const updatedUser = await res.json();

      // Lưu lại user mới vào localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("Cập nhật thông tin thành công!");
      setEditing(false);
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };


  return (
    <div className="main-content">
      <h1 style={{ marginBottom: "24px" }}>Thông tin tài khoản</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "24px",
        }}
      >
        {/* Thông tin bên trái */}
        <Card>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#1890ff",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                margin: "0 auto 16px",
              }}
            >
              👤
            </div>
            <h3 style={{ margin: "0 0 8px 0" }}>{user.name}</h3>
            <p style={{ color: "#666", margin: 0 }}>{user.email}</p>
          </div>
        </Card>

        {/* Form bên phải */}
        <Card
          title="Thông tin cá nhân"
          extra={
            !editing ? (
              <Button onClick={() => setEditing(true)}>Chỉnh sửa</Button>
            ) : null
          }
        >
          <Form
            layout="vertical"
            initialValues={{
              name: user.name,
              email: user.email,
              phone: user.phone || "",
              address: user.address || "",
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input disabled={!editing} size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input disabled={true} size="large" readOnly= {true}/>
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại">
              <Input disabled={!editing} size="large" />
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ">
              <Input.TextArea rows={3} disabled={!editing} />
            </Form.Item>

            {editing && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "8px" }}
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setEditing(false)}>Hủy</Button>
              </Form.Item>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
