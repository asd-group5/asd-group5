import React, { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout({ isLoggedIn, username, handleLogout }) {
    useEffect(() => {
        console.log("isLoggedIn:", isLoggedIn, "username:", username);
    }, [isLoggedIn, username]);

    return (
        <>
            <nav>
                <ul>
                    {isLoggedIn ? (
                        <>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/payment">Payment</Link></li>
                            <li><Link to="/address">Address</Link></li>
                            <li>
                                Welcome, {username}!
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            <Outlet />
        </>
    )
}