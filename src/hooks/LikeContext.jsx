import { createContext, useState } from "react";
import PropTypes from "prop-types";

// Create the context
const LikesContext = createContext();

// Provider component to wrap around your app
export const LikesProvider = ({ children }) => {
  // State to store whether each sighting is liked by the user
  const [isLikedByUser, setIsLikedByUser] = useState({});

  // Function to toggle the like status of a sighting
  const toggleLike = (sightingId) => {
    setIsLikedByUser((prev) => ({
      ...prev,
      [sightingId]: !prev[sightingId],
    }));
  };

  return (
    <LikesContext.Provider value={{ isLikedByUser, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

// PropTypes for LikesProvider
LikesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LikesContext;
