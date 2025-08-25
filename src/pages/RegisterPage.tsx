;

import type React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const response = await axios.post(
        "https://localhost:7209/api/User/register", // đổi URL nếu API của bạn khác
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success(response.data.Message || "Đăng ký thành công!");
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.data) {
        message.error(error.response.data.Message || "Đăng ký thất bại!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="auth-container">
      <Card title="Đăng ký tài khoản" className="auth-card">
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

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
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại" size="large" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Đã có tài khoản?{" "}
            <Button type="link" onClick={() => navigate("/login")}>
              Đăng nhập ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
