"use client"

import { StarFilled } from "@ant-design/icons"
import { Button, Card, Carousel, Col, Row, Typography } from "antd"
import axios from "axios"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [bestSellers, setBestSellers] = useState<any[]>([])

  const fetchAllProduct = async () => {
    try {
      const response = await axios.get("https://localhost:7209/api/Product")
      const allProducts = response.data

      setProducts(allProducts)

      if (allProducts.length > 0) {
        // Nổi bật (6 sản phẩm ngẫu nhiên)
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random())
        setFeaturedProducts(shuffled.slice(0, 6))

        // Bán chạy (3 sản phẩm ngẫu nhiên khác)
        const shuffledBest = [...allProducts].sort(() => 0.5 - Math.random())
        setBestSellers(shuffledBest.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  const navigate = useNavigate()

  const heroSlides = [
    {
      title: "Cơn mưa ưu đãi mùa hè!",
      subtitle: "Giảm 25% cho tất cả sản phẩm",
      buttonText: "MUA NGAY",
      buttonText2: "TÌM HIỂU THÊM",
      image: "/slider1.png",
    },
    {
      title: "Bộ sưu tập mới 2025",
      subtitle: "Khám phá xu hướng thời trang mới nhất",
      buttonText: "KHÁM PHÁ",
      buttonText2: "XEM TẤT CẢ",
      image: "/slider2.png",
    },
    {
      title: "Ưu đãi có hạn",
      subtitle: "Giảm đến 50% cho các mặt hàng chọn lọc",
      buttonText: "MUA SALE",
      buttonText2: "CHI TIẾT",
      image: "/slide5.png",
    },
  ]

  const brandLogos = ["Adidas", "Nike", "Puma", "Gucci", "Louis Vuitton", "Prada"]

  const promoCards = [
    {
      title: "Giảm giá 20% áo thun",
      description: "Bộ sưu tập mùa hè năng động, phong cách cho những ngày nắng nóng. Chất liệu cotton thoáng mát.",
      buttonText: "MUA NGAY",
      image: "/aothun1.png",
      bgColor: "#8B5A5A",
    },
    {
      title: "Quần jeans - Phong cách vượt thời gian",
      description: "Đa dạng kiểu dáng và màu sắc, phù hợp cho mọi dịp. Bền bỉ với thời gian và xu hướng.",
      buttonText: "KHÁM PHÁ",
      image: "/quanjean1.png",
      bgColor: "#2C5F5F",
    },
    {
      title: "Thời trang công sở",
      description: "Bộ sưu tập vest, áo sơ mi và phụ kiện công sở hiện đại. Giúp bạn tự tin và chuyên nghiệp hơn.",
      buttonText: "XEM NGAY",
      image: "/thoitrangcongso1.png",
      bgColor: "#8B4A8B",
    },
  ]

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* HERO SLIDER */}
      <div style={{ marginBottom: "60px" }}>
        <Carousel autoplay dots={false} effect="fade">
          {heroSlides.map((slide, index) => (
            <div key={index}>
              <div
                style={{
                  height: "70vh",
                  minHeight: "500px",
                  background: `linear-gradient(135deg, rgba(44,95,95,0.3), rgba(44,95,95,0.1)), url(${slide.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", width: "100%" }}>
                  <div style={{ maxWidth: "600px", color: "white" }}>
                    <Title level={1} style={{ color: "white", fontSize: "4rem", fontWeight: "700", marginBottom: "20px", lineHeight: "1.1" }}>
                      {slide.title}
                    </Title>
                    <Text style={{ fontSize: "1.5rem", color: "white", display: "block", marginBottom: "40px", fontWeight: "300" }}>
                      {slide.subtitle}
                    </Text>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/products")}
                        style={{
                          height: "50px",
                          fontSize: "14px",
                          padding: "0 30px",
                          background: "white",
                          color: "#2C5F5F",
                          border: "none",
                          fontWeight: "600",
                          letterSpacing: "1px",
                        }}
                      >
                        {slide.buttonText}
                      </Button>
                      <Button
                        size="large"
                        onClick={() => navigate("/products")}
                        style={{
                          height: "50px",
                          fontSize: "14px",
                          padding: "0 30px",
                          background: "transparent",
                          color: "white",
                          border: "2px solid white",
                          fontWeight: "600",
                          letterSpacing: "1px",
                        }}
                      >
                        {slide.buttonText2}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* BRAND LOGOS */}
      <div style={{ background: "#f8f9fa", padding: "40px 0", marginBottom: "60px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <Row gutter={[40, 20]} justify="center" align="middle">
            {brandLogos.map((logo, index) => (
              <Col key={index} xs={12} sm={8} md={6} lg={4}>
                <div style={{ textAlign: "center", color: "#333", fontSize: "20px", fontWeight: "600", opacity: 0.9 }}>
                  {logo}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* PROMO CARDS */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", marginBottom: "80px" }}>
        <Row gutter={[24, 24]}>
          {promoCards.map((card, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: "400px",
                      background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${card.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "30px",
                      color: "white",
                    }}
                  >
                    <Title level={3} style={{ color: "white", marginBottom: "10px" }}>
                      {card.title}
                    </Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)", marginBottom: "20px", fontSize: "14px" }}>
                      {card.description}
                    </Text>
                    <Button
                      style={{
                        background: "white",
                        color: "#333",
                        border: "none",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        width: "fit-content",
                      }}
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                }
                style={{ border: "none", borderRadius: "0", overflow: "hidden" }}
                bodyStyle={{ display: "none" }}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", marginBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title level={2} style={{ fontSize: "2.5rem", fontWeight: "400", color: "#333", marginBottom: "10px" }}>
            Sản phẩm nổi bật
          </Title>
          <div style={{ width: "60px", height: "3px", background: "#2C5F5F", margin: "0 auto" }}></div>
        </div>

        <Row gutter={[24, 40]}>
          {featuredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={product.id}>
              <Card
                hoverable
                onClick={() => navigate(`/products/${product.id}`)}
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300&query=fashion product"}
                      alt={product.name}
                      style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
                  </div>
                }
                style={{ border: "none", borderRadius: "0", boxShadow: "none" }}
                bodyStyle={{ padding: "20px 0", textAlign: "center" }}
              >
                <Title level={4} style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px", fontWeight: "400" }}>
                  {product.name}
                </Title>
                <div style={{ marginBottom: "8px" }}>
                  {[...Array(5)].map((_, i) => (
                    <StarFilled key={i} style={{ color: "#ffd700", fontSize: "12px", marginRight: "2px" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                  <Text style={{ textDecoration: "line-through", color: "#999", fontSize: "14px" }}>
                    {(product.price * 1.2).toFixed(2)}₫
                  </Text>
                  <Text style={{ color: "#333", fontSize: "16px", fontWeight: "600" }}>{product.price.toFixed(2)}₫</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* BEST SELLERS */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", marginBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title level={2} style={{ fontSize: "2.5rem", fontWeight: "400", color: "#333", marginBottom: "10px" }}>
            Sản phẩm bán chạy
          </Title>
          <div style={{ width: "60px", height: "3px", background: "#8B0000", margin: "0 auto" }}></div>
        </div>

        <Row gutter={[24, 40]} justify="center">
          {bestSellers.map((product) => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <Card
                hoverable
                onClick={() => navigate(`/products/${product.id}`)}
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300&query=best seller"}
                      alt={product.name}
                      style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
                  </div>
                }
                style={{ border: "none", borderRadius: "0", boxShadow: "none" }}
                bodyStyle={{ padding: "20px 0", textAlign: "center" }}
              >
                <Title level={4} style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px", fontWeight: "500" }}>
                  {product.name}
                </Title>
                <Text style={{ display: "block", marginBottom: "8px", color: "#2C5F5F", fontWeight: "600" }}>
                  {product.price.toFixed(2)}₫
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* FINAL PROMO */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(44,95,95,0.9), rgba(44,95,95,0.7)), url('/slider4.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px 0",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <Title level={2} style={{ color: "white", fontSize: "2.5rem", marginBottom: "20px" }}>
            Ưu đãi đặc biệt
          </Title>
          <Text style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "30px", display: "block" }}>
            Giảm giá đến 50% cho các sản phẩm chọn lọc. Nhanh tay kẻo lỡ!
          </Text>
          <Button
            type="primary"
            size="large"
            style={{
              height: "50px",
              fontSize: "14px",
              padding: "0 40px",
              background: "white",
              color: "#2C5F5F",
              border: "none",
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            MUA NGAY
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
