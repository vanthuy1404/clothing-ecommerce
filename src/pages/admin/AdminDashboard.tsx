import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

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

interface TopCustomer {
  user_id: string;
  name: string;
  total_orders: number;
  total_spent: number;
}

interface RecentOrder {
  order_id: string;
  customer: string;
  total: number;
  status: string;
  created_at: string;
}

interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_users: number;
  revenue_by_month: RevenueByMonth[];
  top_products: TopProduct[];
  top_customers: TopCustomer[];
  recent_orders: RecentOrder[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin");
    if (isAdmin !== "true") {
      navigate("/login/admin");
      return;
    }

    axios
      .get("https://localhost:7209/api/Statistics")
      .then((res) => {
        const dataFromApi = res.data;

        // Fake riêng 2 phần dưới
        const fakeTopCustomers: TopCustomer[] = [
          {
            user_id: "7",
            name: "Lường Đức Trân",
            total_orders: 22,
            total_spent: 12500000,
          },
          {
            user_id: "25",
            name: "Ngân Triều ",
            total_orders: 18,
            total_spent: 9800000,
          },
          {
            user_id: "9",
            name: "Chi Hàn",
            total_orders: 14,
            total_spent: 7550000,
          },
          {
            user_id: "12",
            name: "Đào Minh Châu",
            total_orders: 11,
            total_spent: 6200000,
          },
          {
            user_id: "36",
            name: "Phạm Thị Thu Hương",
            total_orders: 9,
            total_spent: 51000000,
          },
        ];

        const fakeRecentOrders: RecentOrder[] = [
          {
            order_id: crypto.randomUUID(),
            customer: "Nguyễn Minh Hoàng",
            total: 18500000,
            status: "Hoàn thành",
            created_at: "2025-09-21T08:30:00Z",
          },
          {
            order_id: crypto.randomUUID(),
            customer: "Trần Thị Mai",
            total: 1320000,
            status: "Chờ xác nhận",
            created_at: "2025-09-22T10:15:00Z",
          },
          {
            order_id: crypto.randomUUID(),
            customer: "Lê Văn Nam",
            total: 950000,
            status: "Hủy",
            created_at: "2025-09-23T14:45:00Z",
          },
          {
            order_id: crypto.randomUUID(),
            customer: "Phạm Thùy Dung",
            total: 1740000,
            status: "Hoàn thành",
            created_at: "2025-09-24T09:10:00Z",
          },
          {
            order_id: crypto.randomUUID(),
            customer: "Hoàng Anh Tuấn",
            total: 820000,
            status: "Hoàn thành",
            created_at: "2025-09-25T16:25:00Z",
          },
        ];

        setStats({
          ...dataFromApi,
          top_customers: fakeTopCustomers,
          recent_orders: fakeRecentOrders,
        });
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

  // Helper format cho K, M
  const formatNumber = (val: number) => {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
    if (val >= 1_000) return (val / 1_000).toFixed(0) + "K";
    return val.toString();
  };

  // Bảng sản phẩm
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

  // Bảng khách hàng
  const customerColumns = [
    { title: "Khách hàng", dataIndex: "name" },
    {
      title: "Số đơn",
      dataIndex: "total_orders",
      align: "center" as const,
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "total_spent",
      align: "right" as const,
      render: (val: number) => (
        <Text strong style={{ color: "#1677ff" }}>
          {val.toLocaleString()} VND
        </Text>
      ),
    },
  ];

  // Bảng đơn hàng gần đây
  const orderColumns = [
    { title: "Mã đơn", dataIndex: "order_id" },
    { title: "Khách hàng", dataIndex: "customer" },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      align: "right" as const,
      render: (val: number) => (
        <Text strong style={{ color: "#fa541c" }}>
          {val.toLocaleString()} VND
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const color =
          status === "Hoàn thành"
            ? "green"
            : status === "Chờ xác nhận"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
  ];

  const statCards = [
    {
      title: "Doanh thu",
      value: stats.total_revenue,
      color: "#52c41a",
      icon: <DollarOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      formatter: (val: any) => `${Number(val).toLocaleString()} VND`,
    },
    {
      title: "Đơn hàng",
      value: stats.total_orders,
      color: "#1677ff",
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: "#1677ff" }} />,
    },
    {
      title: "Sản phẩm",
      value: stats.total_products,
      color: "#fa8c16",
      icon: <AppstoreOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
    },
    {
      title: "Người dùng",
      value: stats.total_users,
      color: "#722ed1",
      icon: <UserOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[16, 16]}>
        {/* Tổng quan */}
        {statCards.map((item) => (
          <Col xs={24} sm={12} md={6} key={item.title}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    background: item.color + "20",
                    padding: 12,
                    borderRadius: "50%",
                  }}
                >
                  {item.icon}
                </div>
                <Statistic
                  title={<Text type="secondary">{item.title}</Text>}
                  value={item.value}
                  valueStyle={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: item.color,
                  }}
                  formatter={item.formatter}
                />
              </div>
            </Card>
          </Col>
        ))}

        {/* Doanh thu theo tháng */}
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu theo tháng"
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            {stats.revenue_by_month.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.revenue_by_month} barSize={40}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1677ff" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1677ff" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatNumber} />
                  <ReTooltip formatter={(val: any) => val.toLocaleString() + " VND"} />
                  <Bar
                    dataKey="revenue"
                    fill="url(#colorRevenue)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text>Chưa có dữ liệu</Text>
            )}
          </Card>
        </Col>

        {/* Sản phẩm bán chạy */}
        <Col xs={24} md={12}>
          <Card
            title="Sản phẩm bán chạy"
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              rowKey="product_id"
              dataSource={stats.top_products}
              columns={productColumns}
              pagination={false}
              size="middle"
              bordered={false}
              style={{ borderRadius: 8, overflow: "hidden" }}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          </Card>
        </Col>

        {/* Khách hàng chi tiêu nhiều */}
        <Col xs={24} md={12}>
          <Card
            title="Khách hàng chi tiêu nhiều"
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              rowKey="user_id"
              dataSource={stats.top_customers}
              columns={customerColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Đơn hàng gần đây */}
        <Col xs={24} md={12}>
          <Card
            title="Đơn hàng gần đây"
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              rowKey="order_id"
              dataSource={stats.recent_orders}
              columns={orderColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #fff;
        }
      `}</style>
    </div>
  );
}
