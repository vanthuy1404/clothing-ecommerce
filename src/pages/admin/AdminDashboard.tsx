;

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Spin,
  Typography,
  Table,
  Statistic,
  Tooltip,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface RevenueByMonth {
  month: string;
  revenue: number;
}

interface TopProduct {
  product_id: string;
  name: string;
  total_quantity: number;
  total_revenue: number;
}

interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_users: number;
  revenue_by_month: RevenueByMonth[];
  top_products: TopProduct[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin");
    if (isAdmin !== "true") {
      // Nếu không phải admin, điều hướng về trang login
      navigate("/login/admin");
      return;
    }

    axios
      .get("https://localhost:7209/api/Statistics")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching statistics:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <div style={{ padding: 24 }}>Không có dữ liệu</div>;
  }

  const productColumns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => (
        <Text strong style={{ display: "block", textAlign: "center" }}>
          {index + 1}
        </Text>
      ),
      width: 70,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (name: string) => (
        <Tooltip title={name}>
          <Text strong>{name}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Số lượng bán",
      dataIndex: "total_quantity",
      align: "center" as const,
      render: (val: number) => <Text>{val.toLocaleString()}</Text>,
    },
    {
      title: "Doanh thu",
      dataIndex: "total_revenue",
      align: "right" as const,
      render: (val: number) => (
        <Text strong style={{ color: "#52c41a" }}>
          {val.toLocaleString()} VND
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {/* Tổng quan */}
        <Col xs={24}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Doanh thu"
                  value={stats.total_revenue}
                  prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a" }}
                  formatter={(val) =>
                    `${Number(val).toLocaleString()} VND`
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Đơn hàng"
                  value={stats.total_orders}
                  prefix={<ShoppingCartOutlined style={{ color: "#1677ff" }} />}
                  valueStyle={{ color: "#1677ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Sản phẩm"
                  value={stats.total_products}
                  prefix={<AppstoreOutlined style={{ color: "#fa8c16" }} />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Người dùng"
                  value={stats.total_users}
                  prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Doanh thu theo tháng */}
        <Col xs={24} md={12}>
          <Card title="Doanh thu theo tháng">
            {stats.revenue_by_month.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.revenue_by_month}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="revenue" fill="#1677ff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text>Chưa có dữ liệu</Text>
            )}
          </Card>
        </Col>

        {/* Sản phẩm bán chạy */}
        <Col xs={24} md={12}>
          <Card title="Sản phẩm bán chạy">
            <Table
              rowKey="product_id"
              dataSource={stats.top_products}
              columns={productColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
