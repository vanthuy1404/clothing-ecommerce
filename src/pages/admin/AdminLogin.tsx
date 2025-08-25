import type React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../AppContext";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useApp(); // lấy từ context

  const onFinish = (values: { username: string; password: string }) => {
    const { username, password } = values;

    // Kiểm tra cố định
    if (username === "admin" && password === "123456") {
      const adminUser = { id: "admin", name: "Quản trị viên", email: "admin@example.com" };

      // lưu vào context
      setUser(adminUser);
      setIsAdmin(true);

      // lưu vào localStorage để giữ trạng thái sau refresh
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("is_admin", "true");

      message.success("Đăng nhập quản trị viên thành công!");
      navigate("/admin"); // Điều hướng về trang admin dashboard
    } else {
      message.error("Sai tên tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="auth-container">
      <Card title="Đăng nhập quản trị viên" className="auth-card">
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập tài khoản admin" size="large" />
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
            <Button type="link" onClick={() => navigate("/login")}>
              Đăng nhập với tài khoản người dùng
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
