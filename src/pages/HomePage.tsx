;

import type React from "react";
import { Button } from "antd";
import { categories } from "../data";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const fetchAllProduct = async () => {
    try {
      const response = await axios.get("https://localhost:7209/api/Product");
      const allProducts = response.data;

      setProducts(allProducts);

      // Lấy ngẫu nhiên 4 sản phẩm
      if (allProducts.length > 0) {
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random()); // trộn ngẫu nhiên
        const randomFour = shuffled.slice(0, 6); // lấy 6 sp đầu sau khi shuffle
        setFeaturedProducts(randomFour);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const categoryCounts = products.reduce(
    (acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {}
  );

  useEffect(() => {
    fetchAllProduct();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="main-content">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1 className="hero-title">Fashion Store</h1>
        <p className="hero-subtitle">Thời trang cho mọi người</p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/products")}
        >
          Mua sắm ngay
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontSize: "32px",
          }}
        >
          Danh mục sản phẩm
        </h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.name}
              className="category-card"
              onClick={() => navigate("/products")}
              style={{ cursor: "pointer" }}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
              <div
                style={{
                  color: "#666",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                {categoryCounts[category.name] || 0} sản phẩm
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ marginTop: "64px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontSize: "32px",
          }}
        >
          Sản phẩm nổi bật
        </h2>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  }}
>
  {featuredProducts.map((product) => (
    <div
      key={product.id}
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Image wrapper */}
      <div
        style={{
          width: "100%",
          height: "220px", // cố định chiều cao
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
        }}
      >
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: "8px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 600 }}>{product.name}</div>
        <div style={{ fontSize: "15px", fontWeight: "bold", color:" #ff4d4f" }}>
          {product.price.toLocaleString("vi-VN")}đ
        </div>
        <div style={{ flexGrow: 1, fontSize: "14px", color: "#666" }}>
          {product.description}
        </div>
        <Button type="primary" block onClick={() => navigate(`/products`)}>
          Xem chi tiết
        </Button>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default HomePage;
