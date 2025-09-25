"use client"

import {
    EnvironmentOutlined,
    FacebookOutlined,
    InstagramOutlined,
    MailOutlined,
    PhoneOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from "@ant-design/icons"
import { Button, Divider, Input, Space } from "antd"
import type React from "react"
import { useState } from "react"

const Footer: React.FC<{ admin?: boolean }> = ({ admin = false }) => {
  const [email, setEmail] = useState("")

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing email:", email)
      setEmail("")
      // Add your subscription logic here
    }
  }

  return (
    <footer
      style={{
        background: "#2C5F5F", // Updated to match DNK teal color scheme
        color: "white",
        padding: "40px 0 20px",
        marginTop: "auto",
        display: admin ? "none" : "block",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Left Section - Company Info & Contact */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            alignItems: window.innerWidth <= 768 ? "center" : "flex-start",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0 0 8px 0",
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Fashion Store {/* Updated brand name to match DNK design */}
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                margin: "0",
                opacity: 0.9,
                fontStyle: "italic",
              }}
            >
              Thời trang cho mọi người
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "1rem",
                justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
              }}
            >
              <EnvironmentOutlined style={{ fontSize: "1.2rem", color: "#4ECDC4" }} />{" "}
              {/* Updated icon color to teal accent */}
              <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "1rem",
                justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
              }}
            >
              <PhoneOutlined style={{ fontSize: "1.2rem", color: "#4ECDC4" }} />{" "}
              {/* Updated icon color to teal accent */}
              <span>0123 456 789</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "1rem",
                justifyContent: window.innerWidth <= 768 ? "center" : "flex-start",
              }}
            >
              <MailOutlined style={{ fontSize: "1.2rem", color: "#4ECDC4" }} />{" "}
              {/* Updated icon color to teal accent */}
              <span>info@dnkfashion.com</span> {/* Updated email to match DNK brand */}
            </div>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                margin: "0 0 15px 0",
                fontSize: "1.1rem",
              }}
            >
              Theo dõi chúng tôi
            </h4>
            <Space size="large">
              <FacebookOutlined
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px",
                  borderRadius: "50%",
                  color: "#4ECDC4", // Updated social media icons color to teal accent
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)"
                  e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              />
              <InstagramOutlined
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px",
                  borderRadius: "50%",
                  color: "#4ECDC4",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)"
                  e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              />
              <TwitterOutlined
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px",
                  borderRadius: "50%",
                  color: "#4ECDC4",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)"
                  e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              />
              <YoutubeOutlined
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px",
                  borderRadius: "50%",
                  color: "#4ECDC4",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)"
                  e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              />
            </Space>
          </div>
        </div>

        {/* Right Section - Newsletter */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "30px",
              borderRadius: "15px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h3
              style={{
                color: "#fff",
                margin: "0 0 10px 0",
                fontSize: "1.4rem",
                textAlign: "center",
              }}
            >
              Đăng ký nhận tin
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                opacity: 0.9,
                textAlign: "center",
                fontSize: "0.95rem",
              }}
            >
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Input
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="large"
                style={{ borderRadius: "8px" }}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleSubscribe}
                style={{
                  borderRadius: "8px",
                  background: "#4ECDC4", // Updated button color to teal accent
                  borderColor: "#4ECDC4",
                  color: "#fff",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#45B7B8"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4ECDC4"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider
        style={{
          borderColor: "rgba(255,255,255,0.3)",
          margin: "30px 0 20px 0",
        }}
      />

      <div
        style={{
          textAlign: "center",
          opacity: 0.8,
          fontSize: "0.9rem",
        }}
      >
        <p style={{ margin: 0 }}>© 2025 DNK Fashion. All rights reserved.</p> {/* Updated copyright to DNK Fashion */}
      </div>
    </footer>
  )
}

export default Footer
