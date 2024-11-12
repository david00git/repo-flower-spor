// src/api/flowers.js

import { getAuthToken, getUserId } from "../utils/auth";

// const BASE_URL = "https://flowrspot-api.herokuapp.com/api/v1";

export const addFavoriteFlower = async (flowerId) => {
  const userId = getUserId(); // Fetching user ID
  const token = getAuthToken();
  const favoriteApiUrl = `https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerId}/favorites`;

  if (!token) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    const response = await fetch(favoriteApiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }), // Pass user ID in request body
    });

    if (!response.ok) {
      throw new Error("Error adding to favorites");
    }

    const data = await response.json();
    console.log("Added to favorites:", data);
    return data; // Return the data if needed
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    return null;
  }
};
// Removing a favorite flower
export const removeFavoriteFlower = async (flower_Id, fav_flower_id) => {
  const token = getAuthToken();

  const favoriteApiUrl = `https://flowrspot-api.herokuapp.com/api/v1/flowers/${flower_Id}/favorites/${fav_flower_id}`;

  if (!token) {
    console.error("User is not authenticated.");
    return null; // Handle unauthenticated state
  }

  try {
    const response = await fetch(favoriteApiUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error removing from favorites");
    }

    const data = await response.json();
    console.log("Removed from favorites:", data);
    return data; // Return the data if needed
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
    return null;
  }
};

// flowers.js
export const favoriteFlowersFavorite = async (token) => {
  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/flowers/favorites`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching favorite flowers");
    }

    const data = await response.json();
    return data.fav_flowers; // Return only the favorite flowers array
  } catch (error) {
    console.error("Failed to load favorite flowers:", error);
    throw error;
  }
};

export const favoriteFlowers = async () => {
  const token = getAuthToken();

  if (!token) {
    console.error("User is not authenticated.");
    return { favoriteEntries: [], originalFavorites: [] };
  }

  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/flowers/favorites`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching favorite flowers");
    }

    const data = await response.json();

    // Map favorite entries to include both the favorite record's id and the flower's id
    const favoriteEntries = data.fav_flowers.map((fav_flowers) => ({
      fav_flower_id: fav_flowers.id, // ID of the favorite entry (for deletion)
      flower_id: fav_flowers.flower.id, // ID of the flower itself (for UI rendering)
    }));

    return { favoriteEntries, originalFavorites: data.fav_flowers };
  } catch (error) {
    console.error("Failed to load favorite flowers:", error);
    throw error;
  }
};

// Function to fetch all flowers
export const fetchFlowers = async () => {
  try {
    const response = await fetch(
      "https://flowrspot-api.herokuapp.com/api/v1/flowers"
    );
    if (!response.ok) {
      throw new Error("Error fetching flowers");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load flowers:", error);
    throw error;
  }
};

export const getFavFlowerId = async (flowerId) => {
  const token = getAuthToken();

  if (!token) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    const response = await fetch(
      `https://flowrspot-api.herokuapp.com/api/v1/flowers/favorites`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching favorite flowers");
    }

    const data = await response.json();

    console.log("API Response:", data); // Log the full response

    // Check if the response contains the 'fav_flowers' array
    if (data.fav_flowers && Array.isArray(data.fav_flowers)) {
      // Find the flower by comparing flower.id
      const fav_flower = data.fav_flowers.find(
        (fav_flower) => fav_flower.flower.id === flowerId
      );

      console.log("Found fav_flower:", fav_flower); // Log the result of find()

      if (fav_flower) {
        return fav_flower.id; // Return the `id` of the favorite flower
      } else {
        console.log("Flower not found in favorites.");
        return null; // Flower not found in favorites
      }
    } else {
      console.error("No 'fav_flowers' array found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Failed to load favorite flowers:", error);
    throw error;
  }
};
