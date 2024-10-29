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
       <div style={{
           minHeight: '100vh',
           backgroundColor: '#f3f4f6',
           display: 'flex',
           flexDirection: 'column'
       }}>
           <header style={{
               backgroundColor: 'white',
               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
               padding: '1rem 0'
           }}>
               <div style={{
                   maxWidth: '64rem',
                   margin: '0 auto',
                   padding: '0 1rem',
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center'
               }}>
                   <nav style={{ flex: '1' }}>
                       <ul style={{
                           display: 'flex',
                           gap: '2rem',
                           listStyle: 'none',
                           margin: 0,
                           padding: 0
                       }}>
                           <li>
                               <Link to="/" style={{
                                   color: '#111827',
                                   textDecoration: 'none',
                                   fontWeight: '600',
                                   fontSize: '1rem'
                               }}>Home</Link>
                           </li>
                           {isLoggedIn ? (
                               <>
                                   <li>
                                       <Link to="/payment" style={{
                                           color: '#111827',
                                           textDecoration: 'none',
                                           fontWeight: '500',
                                           fontSize: '1rem'
                                       }}>Payment</Link>
                                   </li>
                                   <li>
                                       <Link to="/address" style={{
                                           color: '#111827',
                                           textDecoration: 'none',
                                           fontWeight: '500',
                                           fontSize: '1rem'
                                       }}>Address</Link>
                                   </li>
                               </>
                           ) : (
                               <>
                                   <li>
                                       <Link to="/login" style={{
                                           color: '#111827',
                                           textDecoration: 'none',
                                           fontWeight: '500',
                                           fontSize: '1rem'
                                       }}>Login</Link>
                                   </li>
                                   <li>
                                       <Link to="/register" style={{
                                           color: '#111827',
                                           textDecoration: 'none',
                                           fontWeight: '500',
                                           fontSize: '1rem'
                                       }}>Register</Link>
                                   </li>
                               </>
                           )}
                       </ul>
                   </nav>
                   {isLoggedIn && (
                       <div style={{
                           display: 'flex',
                           alignItems: 'center',
                           gap: '1rem'
                       }}>
                           <span style={{
                               color: '#4b5563',
                               fontSize: '1rem'
                           }}>
                               Welcome, <span style={{ fontWeight: '600', color: '#111827' }}>{username}</span>!
                           </span>
                           <button 
                               onClick={handleLogout}
                               style={{
                                   padding: '0.5rem 1rem',
                                   backgroundColor: '#ef4444',
                                   color: 'white',
                                   border: 'none',
                                   borderRadius: '0.375rem',
                                   fontSize: '0.875rem',
                                   fontWeight: '500',
                                   cursor: 'pointer'
                               }}
                           >
                               Logout
                           </button>
                       </div>
                   )}
               </div>
           </header>

           <main style={{ flex: '1', padding: '2rem 1rem' }}>
               {isLoggedIn ? (
                   <Outlet />
               ) : (
                   <div style={{
                       maxWidth: '32rem',
                       margin: '4rem auto',
                       padding: '2rem',
                       backgroundColor: 'white',
                       borderRadius: '0.5rem',
                       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                       textAlign: 'center'
                   }}>
                       <h2 style={{
                           fontSize: '1.875rem',
                           fontWeight: '700',
                           color: '#111827',
                           marginBottom: '1rem'
                       }}>Welcome to Our Service</h2>
                       <p style={{
                           color: '#4b5563',
                           marginBottom: '2rem'
                       }}>Please log in to access all features.</p>
                       <div style={{
                           display: 'flex',
                           gap: '1rem',
                           justifyContent: 'center'
                       }}>
                           <button 
                               onClick={() => navigate('/login')}
                               style={{
                                   padding: '0.75rem 1.5rem',
                                   backgroundColor: '#2563eb',
                                   color: 'white',
                                   border: 'none',
                                   borderRadius: '0.375rem',
                                   fontSize: '1rem',
                                   fontWeight: '500',
                                   cursor: 'pointer'
                               }}
                           >
                               Log In
                           </button>
                           <button 
                               onClick={() => navigate('/register')}
                               style={{
                                   padding: '0.75rem 1.5rem',
                                   backgroundColor: 'white',
                                   color: '#374151',
                                   border: '2px solid #d1d5db',
                                   borderRadius: '0.375rem',
                                   fontSize: '1rem',
                                   fontWeight: '500',
                                   cursor: 'pointer'
                               }}
                           >
                               Register
                           </button>
                       </div>
                   </div>
               )}
           </main>
       </div>
   );
}