// App.jsx
import Home from "./pages/Home";
import LoginSignup from './pages/LoginSignup';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentPage from './pages/PaymentPage';
import AddressPage from './pages/AddressPage';
import OrderPage from './pages/OrderPage';
import SchedulePage from './pages/SchedulePage'

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const checkLoggedInUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };
        const response = await axios.get("http://127.0.0.1:8000/api/user/", config);
        setIsLoggedIn(true);
        setUsername(response.data.username);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  useEffect(() => {
    // Check if user is logged in whenever the component mounts
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
        await axios.post("http://127.0.0.1:8000/api/logout/", { "refresh": refreshToken }, config);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUsername("");
        console.log("Log out successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
    }
  };

  return (
    <Routes>
      <Route path="/"element={<LoginSignup isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername}/>}/>
      <Route path="home" element={<Home isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} checkLoggedInUser={checkLoggedInUser}/>}/>
      <Route path="payment" element={<PaymentPage />} />
      <Route path="address" element={<AddressPage />} />
      <Route path="/Cart" /* element={isLoggedIn ? <OrderCustomisation/> : <LoginSignup/>}  */ element={<OrderPage/> }/>
      <Route path="/Cart/Schedule" element={<SchedulePage/>}/>
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
