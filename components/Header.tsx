// 

// import React, { useEffect, useState } from "react"
// import { Layout, Menu, Badge, Avatar, Dropdown, Button, Space } from "antd"
// import {
//   ShoppingCartOutlined,
//   UserOutlined,
//   HomeOutlined,
//   AppstoreOutlined,
//   LogoutOutlined,
//   SettingOutlined,
// } from "@ant-design/icons"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"

// const { Header: AntHeader } = Layout

// interface User {
//   id: string
//   name: string
//   email: string
// }

// interface CartItem {
//   id: string
//   product_id: string
//   quantity: number
// }

// const Header: React.FC = () => {
//   const navigate = useNavigate()
//   const [user, setUser] = useState<User | null>(null)
//   const [cartCount, setCartCount] = useState(0)
//   const [currentPage, setCurrentPage] = useState("home")

//   // Load user từ localStorage và fetch cart
//   useEffect(() => {
//     const userString = localStorage.getItem("user")
//     if (userString) {
//       const userObj: User = JSON.parse(userString)
//       setUser(userObj)
//       fetchCartCount(userObj.id)
//     } else {
//       setUser(null)
//       setCartCount(0)
//     }
//   }, [])

//   const fetchCartCount = async (userId: string) => {
//     try {
//       const res = await axios.get(`https://localhost:7209/api/Cart/${userId}`)
//       setCartCount(res.data.length)
//     } catch (err) {
//       console.error("Error fetching cart:", err)
//       setCartCount(0)
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("user")
//     setUser(null)
//     setCartCount(0)
//     navigate("/")
//     setCurrentPage("home")
//   }

//   const menuItems = [
//     { key: "home", icon: <HomeOutlined />, label: "Trang chủ" },
//     { key: "products", icon: <AppstoreOutlined />, label: "Sản phẩm" },
//   ]

//   const userMenuItems = [
//     { key: "account", icon: <SettingOutlined />, label: "Tài khoản" },
//     { key: "orders", icon: <AppstoreOutlined />, label: "Đơn hàng" },
//     { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
//   ]

//   const handleMenuClick = ({ key }: { key: string }) => {
//     if (key === "logout") {
//       logout()
//     } else {
//       navigate(`/${key}`)
//       setCurrentPage(key)
//     }
//   }

//   return (
//     <AntHeader
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         background: "#fff",
//         borderBottom: "1px solid #f0f0f0",
//         padding: "0 24px",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <div
//           style={{
//             fontSize: "20px",
//             fontWeight: "bold",
//             marginRight: "32px",
//             color: "#1890ff",
//             cursor: "pointer",
//           }}
//           onClick={() => {
//             navigate("/")
//             setCurrentPage("home")
//           }}
//         >
//           Fashion Store
//         </div>

//         <Menu
//           mode="horizontal"
//           selectedKeys={[currentPage]}
//           items={menuItems}
//           onClick={handleMenuClick}
//           style={{ border: "none", minWidth: "200px" }}
//         />
//       </div>

//       <Space size="large">
//         <Badge count={cartCount} size="small">
//           <Button
//             type="text"
//             icon={<ShoppingCartOutlined style={{ fontSize: "18px" }} />}
//             onClick={() => {
//               navigate("/cart")
//               setCurrentPage("cart")
//             }}
//           />
//         </Badge>

//         {user ? (
//           <Dropdown
//             menu={{ items: userMenuItems, onClick: handleMenuClick }}
//             placement="bottomRight"
//           >
//             <Space style={{ cursor: "pointer" }}>
//               <Avatar icon={<UserOutlined />} />
//               <span>{user.name}</span>
//             </Space>
//           </Dropdown>
//         ) : (
//           <Space>
//             <Button
//               onClick={() => {
//                 navigate("/login")
//                 setCurrentPage("login")
//               }}
//             >
//               Đăng nhập
//             </Button>
//             <Button
//               type="primary"
//               onClick={() => {
//                 navigate("/register")
//                 setCurrentPage("register")
//               }}
//             >
//               Đăng ký
//             </Button>
//           </Space>
//         )}
//       </Space>
//     </AntHeader>
//   )
// }

// export default Header
