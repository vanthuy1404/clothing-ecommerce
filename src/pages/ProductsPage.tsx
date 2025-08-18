"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button, Select, Input, Modal, Radio, message, Space } from "antd";
import type { Product } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductsPage: React.FC = () => {
  const userString = localStorage.getItem("user");
  const user = userString? JSON.parse(userString): null
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  // Helper function để parse JSON strings
  const parseJsonField = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };

  const fetchAllProduct = async () => {
    try {
      const response = await axios.get("https://localhost:7209/api/Product");
      // Process products to parse JSON fields
      const processedProducts = response.data.map((product: any) => ({
        ...product,
        sizes: parseJsonField(product.sizes),
        colors: parseJsonField(product.colors)
      }));
      
      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Lỗi tải danh sách sản phẩm");
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    // Check if product has sizes and colors
    if (!product.sizes || product.sizes.length === 0) {
      message.error("Sản phẩm không có thông tin kích thước");
      return;
    }

    if (!product.colors || product.colors.length === 0) {
      message.error("Sản phẩm không có thông tin màu sắc");
      return;
    }

    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setModalVisible(true);
  };

  const handleConfirmAddToCart = async () => {
    if (selectedProduct && selectedSize && selectedColor && user) {
      try {
        await axios.post("https://localhost:7209/api/Cart", {
          user_id: user.id,
          product_id: selectedProduct.id,
          quantity: 1, // mặc định thêm 1, có thể cho chọn số lượng sau
          size: selectedSize,
          color: selectedColor,
        });

        message.success("Đã thêm sản phẩm vào giỏ hàng!");
        setModalVisible(false);
      } catch (error) {
        console.error("Error adding to cart:", error);
        message.error("Không thể thêm sản phẩm vào giỏ hàng");
      }
    }
  };

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: "24px" }}>Sản phẩm</h1>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-row">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 300 }}
            onSearch={setSearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Select style={{ width: 200 }} value={selectedCategory} onChange={setSelectedCategory}>
            <Select.Option value="all">Tất cả danh mục</Select.Option>
            {categories
              .filter((c) => c !== "all")
              .map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
          </Select>
          <div style={{ marginLeft: "auto", color: "#666" }}>
            Tìm thấy {filteredProducts.length} sản phẩm
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                  {product.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="product-description">{product.description}</div>
                <div
                  style={{
                    marginBottom: "12px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Còn lại: {product.stock} sản phẩm
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Không tìm thấy sản phẩm</div>
          <div className="empty-description">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      <Modal
        title={`Thêm "${selectedProduct?.name}" vào giỏ hàng`}
        open={modalVisible}
        onOk={handleConfirmAddToCart}
        onCancel={() => setModalVisible(false)}
        okText="Thêm vào giỏ"
        cancelText="Hủy"
        okButtonProps={{ disabled: !selectedSize || !selectedColor }}
      >
        {selectedProduct && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <strong>Giá: </strong>
              <span
                style={{
                  color: "#ff4d4f",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {selectedProduct.price.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Kích thước: </strong>
                <span style={{ color: "red" }}>*</span>
              </div>
              <Radio.Group
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <Space>
                  {selectedProduct.sizes && selectedProduct.sizes.map((size) => (
                    <Radio.Button key={size} value={size}>
                      {size}
                    </Radio.Button>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Màu sắc: </strong>
                <span style={{ color: "red" }}>*</span>
              </div>
              <Radio.Group
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <Space>
                  {selectedProduct.colors && selectedProduct.colors.map((color) => (
                    <Radio.Button key={color} value={color}>
                      {color}
                    </Radio.Button>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;