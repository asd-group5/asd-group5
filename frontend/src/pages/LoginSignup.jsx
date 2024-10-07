import React, { useState, useEffect } from "react";
import styles from './LoginSignup.module.css';
import user from '../Assets/user.png';
import mail from '../Assets/mail.png';
import password from '../Assets/padlock.png';
import food from '../Assets/food.jpg';
import axios from "axios"
import { Navigate, useNavigate } from 'react-router-dom';

export default function LoginSignup() {


    const [formData, setFormData] = useState({
        username: "",
        email:"",
        password1:"",
        password2:"",
    });
    const [formLoginData, setFormLoginData] = useState({
        email:"",
        password:""
    });
    const handleChange = (e) => {
        setError(null)
        if (action === "Sign Up") {
            setFormData({
                ...formData,
                [e.target.name]:e.target.value
            })
        }
        else {
            setFormLoginData({
                ...formLoginData,
                [e.target.name]:e.target.value
            })
        }
 
    }
    const [error, setError] = useState(null)
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e) => {
        if (action === "Sign Up") {
            e.preventDefault();

            try {
                const response = await axios.post("http://127.0.0.1:8000/api/register/", formData)
                localStorage.setItem("accessToken", response.data.tokens.access);
                localStorage.setItem("refreshToken", response.data.tokens.refresh);
                setIsRegistered(true);
            }
            catch (error) {
                const errorMsg = error.response;
                const errorMsgInfo = errorMsg.data;
                if (errorMsg && errorMsgInfo) {
                    Object.keys(errorMsgInfo).forEach(field => {
                        const errorMessages = error.response.data[field];
                        if (errorMessages && errorMessages.length > 0) {
                            setError(errorMessages[0])
                        }
                    })
                }
            }
        }
        else {
            e.preventDefault();
    
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/login/", formLoginData)
                localStorage.setItem("accessToken", response.data.tokens.access);
                localStorage.setItem("refreshToken", response.data.tokens.refresh)
                navigate("/Home");
            }
            catch (error) {
                if (error.response && error.response.data) {
                    Object.keys(error.response.data).forEach(field => {
                        const errorMessages = error.response.data[field];
                        if (errorMessages && errorMessages.length > 0) {
                            setError(errorMessages[0])
                        }
                    })
                }
            }
        }

    }
    const navigate = useNavigate(); 

    useEffect(() => {

        if (isRegistered) {
            navigate("/home");
        }
    }, [isRegistered, navigate]);

    const [action, setAction] = useState("Sign Up");
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.height = "100%";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";

        return () => {
            document.body.style = "";
        };
    }, []);
    return (
        <form className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>{action}</div>
                <div className={styles.underline}></div>
            </div>
            <div className={styles.inputContainer}>
                {action === "Login" ? <div></div> : 
                    <div className={styles.input}>
                        <img className={styles.img} src={user} alt="User Icon" />
                        <input type="text" placeholder="Name" name='username' value={formData.username} onChange={handleChange}/>
                    </div>
                }

                <div className={styles.input}>
                    <img className={styles.img} src={mail} alt="Mail Icon" />
                    {action == "Sign Up" ? <input type="email" placeholder="Email" name='email' value={formData.email}  onChange={handleChange}/> : <input type="email" placeholder="Email" name='email' value={formLoginData.email}  onChange={handleChange}/>}
                </div>
                <div className={styles.input}>
                    <img className={styles.img} src={password} alt="Password Icon" />
                    {action == "Sign Up" ? <input type="password" placeholder="Password" name='password1' value={formData.password1}  onChange={handleChange}/> : <input type="password" placeholder="Password" name='password' value={formLoginData.password}  onChange={handleChange}/>}
                    
                </div>
            </div>
            {action === "Sign Up" ? <div className={styles.input}> <img className={styles.img} src={password} alt="Password Icon"/> <input type="password" placeholder="Confirm Password" name='password2' value={formData.password2} onChange={handleChange}/> </div> : 
                <div className={styles.forottenPw}>
                    Administrator? <span><a href="http://127.0.0.1:8000/admin/">Click Here</a></span>
                </div>
            }
            <button className={styles.submit} onClick={handleSubmit}>Submit</button>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.submitContainer}>
                <div 
                    className={`${styles.switch} ${action === "Login" ? styles.gray : ""}`} 
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </div>
                <div 
                    className={`${styles.switch} ${action === "Sign Up" ? styles.gray : ""}`} 
                    onClick={() => setAction("Login")}
                >
                    Login
                </div>
            </div>
        </form>
    );
}
