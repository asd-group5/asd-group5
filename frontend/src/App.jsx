import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from  "./pages/Home"
import Login from  "./pages/Login"
import Register from  "./pages/Register"
import Layout from  "./pages/Layout"
import OrderCustomisation from './components/OrderCustomisation';
import axios from "axios"
import { useEffect, useState } from 'react';

function App() {
  const [auth, setAuth] = useState(false);

  const checkLoggedInUser = async () =>{
    
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const config = {
          headers: {
            "Authorization":`Bearer ${token}`
          }
        };
        axios.get("http://127.0.0.1:8000/api/user/", config)
          .then(()=>{
              setAuth(true);
            }
          )
      }
    }
    catch(error) {
      console.log(error);
      setAuth(false);
    }
  }

  useEffect(() => {
    checkLoggedInUser();
  }, [])

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Layout/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="Register" element={<Register/>}/>
          <Route path="Home" element={<Home/>}/>
          <Route 
            path="/Customisation" 
            element={auth ? <OrderCustomisation/> : <Login/>}
          />
      </Routes>
    </BrowserRouter>
  )
}

export default App
