import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { Product } from "../../types";

const { Option } = Select;
const { TextArea } = Input;

const API_URL = "https://localhost:7209/api/Product";

// custom màu primary
const primaryBtnStyle = {
  backgroundColor: "#2C5F5F",
  borderColor: "#2C5F5F",
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();

      const parsed = data.map((p: any) => ({
        ...p,
        sizes: JSON.parse(p.sizes),
        colors: JSON.parse(p.colors),
      }));

      setProducts(parsed);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts(products.filter((p) => p.id !== id));
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const productData = {
        id: editingProduct ? editingProduct.id : uuidv4(),
        ...values,
        sizes: JSON.stringify(values.sizes.split(",").map((s: string) => s.trim())),
        colors: JSON.stringify(values.colors.split(",").map((c: string) => c.trim())),
        price: Number(values.price),
        stock: Number(values.stock),
      };

      if (editingProduct) {
        const res = await fetch(`${API_URL}/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error("Update failed");
        const updatedProduct = await res.json();
        updatedProduct.sizes = JSON.parse(updatedProduct.sizes);
        updatedProduct.colors = JSON.parse(updatedProduct.colors);

        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error("Create failed");
        const newProduct = await res.json();
        newProduct.sizes = JSON.parse(newProduct.sizes);
        newProduct.colors = JSON.parse(newProduct.colors);

        setProducts([...products, newProduct]);
        message.success("Thêm sản phẩm thành công");
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) => (
        <img
          src={image.startsWith("http") ? image : `/${image}`}
          alt="Product"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock > 20 ? "green" : stock > 5 ? "orange" : "red"}>
          {stock}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            style={primaryBtnStyle}
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 600, color: "#2C5F5F" }}>
          Quản lý sản phẩm
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={primaryBtnStyle}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />

      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
        okButtonProps={{ style: primaryBtnStyle }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value="Áo">Áo</Option>
              <Option value="Quần">Quần</Option>
              <Option value="Váy">Váy</Option>
              <Option value="Áo Khoác">Áo Khoác</Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Tồn kho"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item
            name="sizes"
            label="Kích thước (phân cách bằng dấu phẩy)"
            rules={[{ required: true, message: "Vui lòng nhập kích thước" }]}
          >
            <Input placeholder="S, M, L, XL" />
          </Form.Item>

          <Form.Item
            name="colors"
            label="Màu sắc (phân cách bằng dấu phẩy)"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
          >
            <Input placeholder="Trắng, Đen, Xám" />
          </Form.Item>

          <Form.Item
            name="image"
            label="URL hình ảnh"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
          >
            <Input placeholder="https://media.image.com/example.png" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
