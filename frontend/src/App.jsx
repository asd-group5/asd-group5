import './App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./pages/Header"
import PaymentPage from './pages/PaymentPage';
import AddressPage from './pages/AddressPage';
import OrderCustomisation from './components/OrderCustomisation';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const response = await axios.get("http://127.0.0.1:8000/api/user/", config)
          setIsLoggedIn(true);
          setUsername(response.data.username);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser();
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken && refreshToken) {
        const config = {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        };
        await axios.post("http://127.0.0.1:8000/api/logout/", { "refresh": refreshToken }, config)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUsername("");
        console.log("Log out successful!")
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message)
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Header isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />}>
        <Route index element={<Home isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />} />
        <Route path="home" element={<Home isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="address" element={<AddressPage />} />
      </Route>
      <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
      <Route path="register" element={<Register />} />
      <Route 
            path="/Customisation" 
            element={isLoggedIn ? <OrderCustomisation/> : <Login/>}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;