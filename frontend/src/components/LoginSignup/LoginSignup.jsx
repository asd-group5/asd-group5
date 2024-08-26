import React from "react";
import './LoginSignup.css';
import App from "../../App";
// import user from 'Assests/user.png';
// import mail from 'Assests/mail.png';
// import password from 'Assests/password.png';


export default function LoginSignup() {
    return (
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user} alt=""></img>
                    <input type="text"/>
                </div>
                <div className="input">
                    <img src="" alt=""></img>
                    <input type="email"/>
                </div>
                <div className="input">
                    <img src="" alt=""></img>
                    <input type="password"/>
                </div>
            </div>
        </div>
    )
}