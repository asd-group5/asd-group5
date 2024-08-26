import React, { useState, useEffect } from 'react'
import axios from "axios"
import { Navigate, useNavigate } from 'react-router-dom';

export default function Register() {

    const [formData, setFormData] = useState({
        username: "",
        email:"",
        password1:"",
        password2:"",
    });
    const handleChange = (e) => {
        setError(null) // removes error msg when typing again
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const [error, setError] = useState(null)
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register/", formData)
            // console.log("Sent Data", response.data);
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);
            setIsRegistered(true);
        }
        catch (error) {
            // console.log(error);
            const errorMsg = error.response;
            const errorMsgInfo = errorMsg.data;
            if (errorMsg && errorMsgInfo) {// check error object for each field, if error exists, display that field error
                Object.keys(errorMsgInfo).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0])
                    }
                })
            }
        }
    }
    const navigate = useNavigate(); 

    useEffect(() => {

        if (isRegistered) {
            navigate("/Home");
        }
    }, [isRegistered, navigate]);

    return (
        <div>
            {error && <p style={{color:"red"}}>{error}</p>}
            <h1>Register:</h1>
            <form>
                <label>username:</label><br/>
                <input type="text" name='username' value={formData.username} onChange={handleChange}></input>
                <br/>
                <label>email:</label><br/>
                <input type="email" name='email' value={formData.email} onChange={handleChange}></input>
                <br/>
                <label>password:</label><br/>
                <input type="password" name='password1' value={formData.password1} onChange={handleChange}></input>
                <br/>
                <label>confirm password:</label><br/>
                <input type="password" name='password2' value={formData.password2} onChange={handleChange}></input>
                <br/>
                <button type='submit' onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}