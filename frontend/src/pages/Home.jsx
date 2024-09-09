import React, { useEffect } from 'react';

export default function Home({ isLoggedIn, username, handleLogout, checkLoggedInUser }) {
  useEffect(() => {
    checkLoggedInUser();
  }, [checkLoggedInUser]);

  if (!isLoggedIn) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h2>Hi, {username}. Thanks for logging in!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
