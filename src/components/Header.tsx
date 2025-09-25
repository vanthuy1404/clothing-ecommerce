"use client"

import type React from "react"

import { Avatar, Badge, Dropdown, type MenuProps } from "antd"
import axios from "axios"
import dayjs from "dayjs"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Header: React.FC = () => {
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null
  const admin = localStorage.getItem("is_admin") === "true" // check admin
  const [cartCount, setCartCount] = useState(0)
  const [coupons, setCoupons] = useState<any[]>([])

  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  // Fetch cart count
  const fetchCartCount = useCallback(async (userId: string) => {
    try {
      const res = await axios.get(`https://localhost:7209/api/Cart/${userId}`)
      setCartCount(res.data.length)
    } catch {
      setCartCount(0)
    }
  }, [])
  // Fetch valid coupons
  const fetchValidCoupons = useCallback(async () => {
    try {
      const res = await axios.get("https://localhost:7209/api/Coupon/valid")
      setCoupons(res.data)
    } catch {
      setCoupons([])
    }
  }, [])

  useEffect(() => {
    if (user && !admin) {
      fetchCartCount(user.id)
    } else {
      setCartCount(0)
    }
  }, [user, admin])
  useEffect(() => {
    fetchValidCoupons()
  }, [fetchValidCoupons])

  // Logout
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("authToken")
    localStorage.removeItem("is_admin")
    setCartCount(0)
    navigate("/")
    window.location.reload() // reload để cập nhật header
  }

  const handleCartClick = () => {
    if (user) {
      navigate("/cart")
    } else {
      navigate("/login")
    }
  }

  const userMenuItems: MenuProps["items"] = [
    { key: "/account", label: "Tài khoản" },
    { key: "/orders", label: "Đơn hàng" },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất" },
  ]

  const adminMenuItems: MenuProps["items"] = [{ key: "logout", label: "Đăng xuất" }]

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout()
    } else {
      navigate(key)
    }
  }

  // Menu coupon
  const couponMenu: MenuProps["items"] = coupons.map((c) => ({
    key: c.id,
    label: (
      <div
        style={{
          maxWidth: 280,
          padding: "10px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* Header: Mã coupon + phần trăm giảm */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "green", // xanh lá cây
              fontSize: "14px",
            }}
          >
            🎟️ {c.ma_coupon}
          </span>
          <span
            style={{
              backgroundColor: "#f9f0ff",
              color: "#722ed1", // tím
              fontWeight: "bold",
              fontSize: "13px",
              padding: "2px 6px",
              borderRadius: "6px",
            }}
          >
            -{c.phan_tram}%
          </span>
        </div>

        {/* Nội dung */}
        <div
          style={{
            fontSize: "13px",
            color: "#555",
            marginBottom: "6px",
          }}
        >
          {c.noi_dung}
        </div>

        {/* Ngày hiệu lực */}
        <small
          style={{
            display: "block",
            fontSize: "12px",
            color: "#999",
          }}
        >
          Hiệu lực:{" từ "}
          {dayjs(c.ngay_bat_dau).format("DD/MM/YYYY")} đến {dayjs(c.ngay_ket_thuc).format("DD/MM/YYYY")}
        </small>
      </div>
    ),
  }))

  return (
    <header
      style={{
        background: "#2C5F5F", // Updated to match DNK teal color scheme instead of purple gradient
        color: "white",
        padding: "15px 0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          Fashion Store {/* Updated brand name to match DNK design */}
        </div>

        {admin ? (
          <nav
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: currentPath === "/admin" ? "rgba(78, 205, 196, 0.2)" : "transparent", // Updated active state color to teal
                backdropFilter: currentPath === "/admin" ? "blur(10px)" : "none",
                border: currentPath === "/admin" ? "1px solid rgba(78, 205, 196, 0.3)" : "1px solid transparent",
              }}
              onClick={() => navigate("/admin")}
              onMouseEnter={(e) => {
                if (currentPath !== "/admin") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)" // Updated hover color to teal
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/admin") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Dashboard
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor:
                  currentPath === "/admin/products-management" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/admin/products-management" ? "blur(10px)" : "none",
                border:
                  currentPath === "/admin/products-management"
                    ? "1px solid rgba(78, 205, 196, 0.3)"
                    : "1px solid transparent",
              }}
              onClick={() => navigate("/admin/products-management")}
              onMouseEnter={(e) => {
                if (currentPath !== "/admin/products-management") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/admin/products-management") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Sản phẩm
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: currentPath === "/admin/orders-management" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/admin/orders-management" ? "blur(10px)" : "none",
                border:
                  currentPath === "/admin/orders-management"
                    ? "1px solid rgba(78, 205, 196, 0.3)"
                    : "1px solid transparent",
              }}
              onClick={() => navigate("/admin/orders-management")}
              onMouseEnter={(e) => {
                if (currentPath !== "/admin/orders-management") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/admin/orders-management") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Đơn hàng
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: currentPath === "/admin/users-management" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/admin/users-management" ? "blur(10px)" : "none",
                border:
                  currentPath === "/admin/users-management"
                    ? "1px solid rgba(78, 205, 196, 0.3)"
                    : "1px solid transparent",
              }}
              onClick={() => navigate("/admin/users-management")}
              onMouseEnter={(e) => {
                if (currentPath !== "/admin/users-management") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/admin/users-management") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Người dùng
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor:
                  currentPath === "/admin/coupons-management" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/admin/coupons-management" ? "blur(10px)" : "none",
                border:
                  currentPath === "/admin/coupons-management"
                    ? "1px solid rgba(78, 205, 196, 0.3)"
                    : "1px solid transparent",
              }}
              onClick={() => navigate("/admin/coupons-management")}
              onMouseEnter={(e) => {
                if (currentPath !== "/admin/coupons-management") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/admin/coupons-management") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Mã giảm giá
            </div>
          </nav>
        ) : (
          <nav
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: currentPath === "/" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/" ? "blur(10px)" : "none",
                border: currentPath === "/" ? "1px solid rgba(78, 205, 196, 0.3)" : "1px solid transparent",
              }}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => {
                if (currentPath !== "/") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Trang chủ
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: currentPath === "/products" ? "rgba(78, 205, 196, 0.2)" : "transparent",
                backdropFilter: currentPath === "/products" ? "blur(10px)" : "none",
                border: currentPath === "/products" ? "1px solid rgba(78, 205, 196, 0.3)" : "1px solid transparent",
              }}
              onClick={() => navigate("/products")}
              onMouseEnter={(e) => {
                if (currentPath !== "/products") {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== "/products") {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              Sản phẩm
            </div>
          </nav>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {!admin && (
            <>
              {/* Cart */}
              <div
                style={{
                  position: "relative",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  padding: "8px",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                }}
                onClick={handleCartClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)" // Updated cart hover color to teal
                  e.currentTarget.style.transform = "scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                🛒
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "#4ECDC4", // Updated cart badge color to teal accent
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Notifications */}
              <Dropdown menu={{ items: couponMenu }} placement="bottomRight" trigger={["click"]}>
                <Badge count={coupons.length} offset={[0, 6]} color="#4ECDC4">
                  {" "}
                  {/* Updated badge color to teal */}
                  <div
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      padding: "8px",
                      borderRadius: "50%",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)" // Updated notification hover color to teal
                      e.currentTarget.style.transform = "scale(1.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                  >
                    🔔
                  </div>
                </Badge>
              </Dropdown>
            </>
          )}

          {user || admin ? (
            <Dropdown
              menu={{
                items: admin ? adminMenuItems : userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(78, 205, 196, 0.1)", // Updated user menu background to teal
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(78, 205, 196, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.1)"
                }}
              >
                <Avatar size="small">👤</Avatar>
                <span>{admin ? "Admin" : user?.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(78, 205, 196, 0.15)", // Updated login button background to teal
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(78, 205, 196, 0.3)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  minWidth: "90px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.25)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(78, 205, 196, 0.15)"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                Đăng nhập
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "#4ECDC4", // Updated register button to solid teal color
                  border: "1px solid #4ECDC4",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  minWidth: "90px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(78, 205, 196, 0.3)",
                }}
                onClick={() => navigate("/register")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#45B7B8"
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(78, 205, 196, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4ECDC4"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(78, 205, 196, 0.3)"
                }}
              >
                Đăng ký
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
