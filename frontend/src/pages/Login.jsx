import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn, setUsername }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) {
            return
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData)
            console.log("Login response:", response.data);
            
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);
            
            setIsLoggedIn(true);
            setUsername(response.data.username);
            
            console.log("Login successful, navigating to home");
            navigate("/home");
        }
        catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setError("Login failed. Please check your credentials.");
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {error && <p style={{color:"red"}}>{error}</p>}
            <h1>Login:</h1>
            <form onSubmit={handleSubmit}>
                <label>email:</label><br/>
                <input type="email" name='email' value={formData.email} onChange={handleChange}></input>
                <br/>
                <br/>
                <label>password:</label><br/>
                <input type="password" name='password' value={formData.password} onChange={handleChange}></input>
                <br/>
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}