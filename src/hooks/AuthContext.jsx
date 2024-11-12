import { createContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useEffect } from "react";

// Create a Context for Auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    return savedLoginStatus === "true"; // Convert string to boolean
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn); // Store login status in localStorage
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validate the prop types
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is passed and is a valid React node
};
