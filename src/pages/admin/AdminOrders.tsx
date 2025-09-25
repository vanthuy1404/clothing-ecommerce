

import { DownOutlined, EyeOutlined, FilePdfOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"
import { Button, Descriptions, Dropdown, message, Modal, Space, Table } from "antd"
import axios from "axios"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Order } from "../../types"

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])
  const navigate = useNavigate()
  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get("https://localhost:7209/api/Order")
      setOrders(res.data)
    } catch (error) {
      console.error(error)
      message.error("Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin");
    if (isAdmin !== "true") {
      // Nếu không phải admin, điều hướng về trang login
      navigate("/login/admin");
      return;
    }
  }, []);


  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
    //   gọi API update status
      await axios.put(`https://localhost:7209/api/Order/${orderId}/status`, { status: newStatus })
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      message.success("Cập nhật trạng thái thành công")
    } catch (error) {
      message.error("Không thể cập nhật trạng thái")
    }
  }
  const handleExportInvoice = async (orderId: string, record: any) => {
  try {
    const response = await axios.post(
      `https://localhost:7209/api/ExportExcel/order/${orderId}`,
      record, // payload chính là OrderDTO
      {
        responseType: "blob", //  bắt buộc để nhận file binary
      }
    );

    // Tạo link download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HoaDon_${orderId}.xlsx`); // tên file tải về
    document.body.appendChild(link);
    link.click();

    message.success("Xuất hóa đơn thành công!");
  } catch (error: any) {
    console.error("Export error:", error);
    message.error(
      `Không thể xuất hóa đơn. ${
        error?.response?.data?.message || "Vui lòng thử lại."
      }`
    );
  }
};


  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setDetailModalVisible(true)
  }
  

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return { background: "#fff7e6", color: "#d48806", border: "1px solid #ffd591" }
      case "Đã xác nhận":
        return { background: "#e6f4ff", color: "#0958d9", border: "1px solid #91caff" }
      case "Đang chuẩn bị":
        return { background: "#e6fffb", color: "#08979c", border: "1px solid #87e8de" }
      case "Đang giao":
        return { background: "#f9f0ff", color: "#722ed1", border: "1px solid #d3adf7" }
      case "Đã giao":
        return { background: "#f6ffed", color: "#389e0d", border: "1px solid #b7eb8f" }
      case "Đã hủy":
        return { background: "#fff1f0", color: "#cf1322", border: "1px solid #ffa39e" }
      case "Đã thanh toán":
        return { background: "#f4ffed", color: "#237804", border: "1px solid #b7eb8f" }
      default:
        return { background: "#fafafa", color: "#666", border: "1px solid #d9d9d9" }
    }
  }

  const statusOptions = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang chuẩn bị",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
    "Yêu cầu hủy",
    "Đã thanh toán",
  ]

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => `#${id}`,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (total: number) => `${total.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status: string, record: Order) => {
        const items: MenuProps["items"] = statusOptions.map((option) => ({
          key: option,
          label: option,
          onClick: () => handleStatusChange(record.id, option),
        }))

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div
              style={{
                ...getStatusStyle(status),
                borderRadius: "16px",
                padding: "4px 12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                fontSize: "13px",
                fontWeight: 500,
                gap: "6px",
              }}
            >
              {status} <DownOutlined style={{ fontSize: "10px" }} />
            </div>
          </Dropdown>
        )
      },
    },
    {
  title: "Thao tác",
  key: "actions",
  width: 220,
  render: (_: any, record: Order) => (
    <Space>
      <Button
        type="primary"
        size="small"
        icon={<EyeOutlined />}
        style={{backgroundColor: "#2C5F5F"}}

        onClick={() => handleViewDetail(record)}
      >
        Chi tiết
      </Button>
      <Button
        type="primary"
        style={{ backgroundColor: "green", borderColor: "green" }}
        size="small"
        icon={<FilePdfOutlined />}
        onClick={() => handleExportInvoice(record.id, record)}
      >
        Xuất HĐ
      </Button>
    </Space>
  ),
}
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>Quản lý đơn hàng</h2>
        <p style={{ color: "#666", margin: 0 }}>
          Tổng cộng: {orders.length} đơn hàng
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã đơn hàng">
                #{selectedOrder.id}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {selectedOrder.date}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <div
                  style={{
                    ...getStatusStyle(selectedOrder.status),
                    borderRadius: "12px",
                    padding: "2px 8px",
                    display: "inline-block",
                    fontSize: "13px",
                  }}
                >
                  {selectedOrder.status}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {selectedOrder.total.toLocaleString("vi-VN")}đ
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={2}>
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {selectedOrder.address}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <h4>Sản phẩm đã đặt:</h4>
              {selectedOrder.items?.length > 0 ? (
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "6px",
                  }}
                >
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom:
                          index < selectedOrder.items.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                      }}
                    >
                      <div>
                        <strong>{item.product.name}</strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Size: {item.size} | Màu: {item.color} | SL: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold" }}>
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#666", fontStyle: "italic" }}>
                  Không có thông tin chi tiết sản phẩm
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminOrders
