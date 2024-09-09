// import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from  "./pages/Home"
import LoginSignup from './pages/LoginSignup';


function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<LoginSignup/>}/>
          <Route path="Home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
