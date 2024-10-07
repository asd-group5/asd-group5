export const getValidToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.exp > Date.now() / 1000) return token;

  return await refreshToken();
};

const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) throw new Error("Failed to refresh token");
    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
