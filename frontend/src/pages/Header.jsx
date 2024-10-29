import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

export default function Layout({ isLoggedIn, username, handleLogout }) {
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn, "username:", username);
  }, [isLoggedIn, username]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <nav
        style={{
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "64rem",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ul
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/home"
                    style={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "color 0.2s",
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/payment"
                    style={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "color 0.2s",
                    }}
                  >
                    Payment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/address"
                    style={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "color 0.2s",
                    }}
                  >
                    Address
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    style={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "color 0.2s",
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    style={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: "500",
                      fontSize: "1rem",
                      transition: "color 0.2s",
                    }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          {isLoggedIn && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  color: "#4b5563",
                  fontSize: "1rem",
                }}
              >
                Welcome,{" "}
                <span style={{ fontWeight: "600", color: "#111827" }}>
                  {username}
                </span>
                !
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
