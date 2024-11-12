const API_URL = "https://flowrspot-api.herokuapp.com/api/v1/sightings";
import { toast } from "react-toastify";
import { getAuthToken } from "../utils/auth";

// Function to create a sighting
export const createSighting = async (formData) => {
  const token = getAuthToken(); // Fetch the token
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const data = await response.json(); // Parse the response data as JSON
    return data; // Return the response data
  } catch (error) {
    console.error("Error creating sighting:", error.message); // Log the error message
    throw error; // Rethrow the error for handling in the component
  }
};

export const deleteSighting = async (id, token) => {
  const url = `${API_URL}/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // toast.success("Sighting deleted successfully", { autoClose: 3000 });

    return { success: true };
  } catch (error) {
    console.log("Failed to delete sighting:", error);
    toast.error(error.message, { autoClose: 5000 });

    return { success: false, message: error.message };
  }
};

// Function to fetch sightings from the API
export const getSightings = async () => {
  const token = getAuthToken(); // Fetch the token
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if response is OK
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized! Please log in again.");
      }
      throw new Error(`Error fetching sightings: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the list of sightings
    return data;
  } catch (error) {
    console.error("Error fetching sightings:", error.message);
    throw error;
  }
};

export const likeSighting = async (sightingId, token, userId) => {
  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/likes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }), // Pass user_id in the request body
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Get detailed error response
      throw new Error(
        `Failed to like sighting: ${errorData.message || response.statusText}`
      );
    }

    return { success: true, message: "Sighting liked successfully." };
  } catch (error) {
    console.error("Like Sighting Error:", error);
    return { success: false, message: error.message };
  }
};

export const unlikeSighting = async (sightingId, token, userId) => {
  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/likes`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }), // Pass user_id in the request body
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Get detailed error response
      throw new Error(
        `Failed to unlike sighting: ${errorData.message || response.statusText}`
      );
    }

    return { success: true, message: "Sighting unliked successfully." };
  } catch (error) {
    console.error("Unlike Sighting Error:", error);
    return { success: false, message: error.message };
  }
};

// Example usage

// Function to get likes and check if the current user liked the sighting
export const getLikes = async (sightingId, token, userId) => {
  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/likes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch likes.");

    const data = await response.json();
    const userLiked = data.likes.some((like) => like.user_id === userId); // Check if the current user liked the sighting

    return {
      success: true,
      likes: data.likes,
      userLiked,
    };
  } catch (error) {
    console.error("Get Likes Error:", error);
    return { success: false, message: error.message };
  }
};
