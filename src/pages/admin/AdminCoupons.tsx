import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Table,
  Tag,
} from "antd"
import axios from "axios"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

interface Coupon {
  id: string
  ma_coupon: string
  phan_tram: number
  noi_dung: string
  ngay_bat_dau: string
  ngay_ket_thuc: string
  created_at: string
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const res = await axios.get("https://localhost:7209/api/Coupon")
      setCoupons(res.data)
    } catch (error) {
      console.error(error)
      message.error("Không thể tải danh sách coupon")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setDetailModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://localhost:7209/api/Coupon/${id}`)
      setCoupons(coupons.filter((c) => c.id !== id))
      message.success("Xóa coupon thành công")
    } catch (error) {
      message.error("Không thể xóa coupon")
    }
  }

  const handleSave = async (values: any) => {
    try {
      if (editingCoupon) {
        // update
        await axios.put(`https://localhost:7209/api/Coupon/${editingCoupon.id}`, {
          ...values,
          ngay_bat_dau: values.ngay_bat_dau.format("YYYY-MM-DDTHH:mm:ss"),
          ngay_ket_thuc: values.ngay_ket_thuc.format("YYYY-MM-DDTHH:mm:ss"),
        })
        message.success("Cập nhật coupon thành công")
      } else {
        // create
        await axios.post("https://localhost:7209/api/Coupon", {
          ...values,
          ngay_bat_dau: values.ngay_bat_dau.format("YYYY-MM-DDTHH:mm:ss"),
          ngay_ket_thuc: values.ngay_ket_thuc.format("YYYY-MM-DDTHH:mm:ss"),
        })
        message.success("Thêm coupon thành công")
      }
      setFormModalVisible(false)
      setEditingCoupon(null)
      form.resetFields()
      loadCoupons()
    } catch (error) {
      message.error("Không thể lưu coupon")
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    form.setFieldsValue({
      ...coupon,
      ngay_bat_dau: dayjs(coupon.ngay_bat_dau),
      ngay_ket_thuc: dayjs(coupon.ngay_ket_thuc),
    })
    setFormModalVisible(true)
  }

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "ma_coupon",
      key: "ma_coupon",
      width: 150,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Phần trăm",
      dataIndex: "phan_tram",
      key: "phan_tram",
      width: 100,
      render: (value: number) => <strong>{value}%</strong>,
    },
    {
      title: "Nội dung",
      dataIndex: "noi_dung",
      key: "noi_dung",
      ellipsis: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngay_bat_dau",
      key: "ngay_bat_dau",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngay_ket_thuc",
      key: "ngay_ket_thuc",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 270,
      render: (_: any, record: Coupon) => (
        <>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Quản lý mã giảm giá</h2>
          <p style={{ color: "#666", margin: 0 }}>
            Tổng cộng: {coupons.length} mã giảm giá
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCoupon(null)
            form.resetFields()
            setFormModalVisible(true)
          }}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết coupon ${selectedCoupon?.ma_coupon}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedCoupon && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã Coupon">
              {selectedCoupon.ma_coupon}
            </Descriptions.Item>
            <Descriptions.Item label="Phần trăm giảm giá">
              {selectedCoupon.phan_tram}%
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {selectedCoupon.noi_dung}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {dayjs(selectedCoupon.ngay_bat_dau).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {dayjs(selectedCoupon.ngay_ket_thuc).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingCoupon ? "Sửa Coupon" : "Thêm Coupon"}
        open={formModalVisible}
        onCancel={() => setFormModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Mã Coupon"
            name="ma_coupon"
            rules={[{ required: true, message: "Vui lòng nhập mã coupon" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phần trăm giảm"
            name="phan_tram"
            rules={[{ required: true, message: "Vui lòng nhập phần trăm" }]}
          >
            <InputNumber min={1} max={100} addonAfter="%" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="noi_dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="ngay_bat_dau"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="ngay_ket_thuc"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminCoupons
