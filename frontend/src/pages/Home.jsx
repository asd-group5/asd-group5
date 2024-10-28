import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout({ isLoggedIn, username, handleLogout, checkLoggedInUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedInUser();
    }, [checkLoggedInUser]);

    useEffect(() => {
        console.log("isLoggedIn:", isLoggedIn, "username:", username);
    }, [isLoggedIn, username]);

    return (
        <div className="layout">
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        {isLoggedIn ? (
                            <>
                                <li><Link to="/payment">Payment</Link></li>
                                <li><Link to="/address">Address</Link></li>
                                <li><Link to="/orders">Orders</Link></li>
                                <li><Link to="/cart">Cart</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
                {isLoggedIn && (
                    <div className="user-info">
                        Welcome, {username}!
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </header>

            <main>
                {isLoggedIn ? (
                    <Outlet />
                ) : (
                    <div className="login-prompt">
                        <h2>Welcome to Our Service</h2>
                        <p>Please log in to access all features.</p>
                        <button onClick={() => navigate('/login')}>Log In</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </div>
                )}
            </main>
        </div>
    );
}