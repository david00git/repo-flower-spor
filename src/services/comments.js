const BASE_URL = "https://flowrspot-api.herokuapp.com/api/v1";
import { toast } from "react-toastify";

// Function to capitalize the first letter of a string and after punctuation
const capitalizeSentences = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences
    .map((sentence) => {
      return (
        sentence.trim().charAt(0).toUpperCase() +
        sentence.trim().slice(1).toLowerCase()
      );
    })
    .join(" ");
};

/*            GET                  */

// Function to fetch comments based on sighting ID
export const fetchComments = async (sighting_id, commentsPerPage) => {
  try {
    const response = await fetch(
      `${BASE_URL}/sightings/${sighting_id}/comments`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const data = await response.json();
    const allComments = data.comments || [];

    // Return the fetched comments and whether there are more comments
    return {
      comments: allComments.slice(0, commentsPerPage),
      hasMore: allComments.length > commentsPerPage,
      allComments: allComments,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/*            CREATE                  */

// Function to create a new comment
export const createComment = async (sightingId, content, token, userId) => {
  const url = `${BASE_URL}/sightings/${sightingId}/comments`;

  const formattedContent = capitalizeSentences(content);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        sighting_id: sightingId,
        content: formattedContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    toast.success("Comment created successfully!");

    // Return the comment object directly
    return data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    toast.error(error.message);
    return null;
  }
};
/*            DELETE                  */

export const deleteComment = async (sightingId, commentId, token) => {
  const url = `${BASE_URL}/sightings/${sightingId}/comments/${commentId}`;

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

    toast.success("Comment deleted successfully!");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    toast.error(error.message);

    return { success: false };
  }
};
