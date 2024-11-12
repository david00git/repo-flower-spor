import { toast } from "react-toastify";

const API_BASE_URL = `https://flowrspot-api.herokuapp.com/api/v1`;

// Custom fetch function to handle token in requests
const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    toast.error("Token not found. Please log in first.");
    return null;
  }

  // Set default headers with authorization token
  const headers = {
    ...options.headers,
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // If unauthorized (401), handle it without refreshing
    if (response.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("auth_token");
      return null;
    }

    return response;
  } catch (err) {
    console.error("Error with request:", err);
    toast.error(err.message || "An error occurred. Please try again.");
    throw err;
  }
};

export const registerUser = async (userData, setIsLoggedIn) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      try {
        const errorResponse = JSON.parse(responseBody);
        throw new Error(errorResponse.error || "Registration failed");
      } catch (jsonError) {
        throw new Error("Registration failed: " + responseBody);
      }
    }

    const regUser = JSON.parse(responseBody);

    if (regUser.auth_token) {
      localStorage.setItem("auth_token", regUser.auth_token);
      setIsLoggedIn(true);
      toast.success("Registration successful! Welcome!");
    }

    return regUser;
  } catch (err) {
    console.error("Error creating user:", err);
    toast.error(err.message || "Registration failed. Please try again.");
    throw err;
  }
};

export const loginUser = async (credentials, setIsLoggedIn) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      try {
        const errorResponse = JSON.parse(responseBody);
        throw new Error(errorResponse.error || "Login failed");
      } catch (jsonError) {
        throw new Error("Login failed: " + responseBody);
      }
    }

    const loginResponse = JSON.parse(responseBody);

    if (loginResponse.auth_token) {
      localStorage.setItem("auth_token", loginResponse.auth_token);
      toast.success("Login successful!");
      setIsLoggedIn(true);
    }

    return loginResponse;
  } catch (err) {
    console.error("Error logging in:", err);
    toast.error("Login failed. Please try again.");
    throw err;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await fetchWithToken(`${API_BASE_URL}/users/me`, {
      method: "GET",
    });

    if (!response) return null; // Token expired or not found

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user information.");
    }

    return data.user;
  } catch (err) {
    console.error("Error fetching user info:", err);
    return null;
  }
};

export const logoutUser = (setIsLoggedIn) => {
  localStorage.removeItem("auth_token");
  setIsLoggedIn(false);
};
