"use client";

import type React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await fetch("https://localhost:7209/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Đăng nhập thất bại!");
      }

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.data));

      message.success("Đăng nhập thành công!");
      navigate("/"); // Điều hướng về trang chủ
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="auth-container">
      <Card title="Đăng nhập" className="auth-card">
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản?{" "}
            <Button type="link" onClick={() => navigate("/register")}>
              Đăng ký ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
