import { useContext } from "react";
import LikesContext from "../hooks/LikeContext";

export function getAuthToken() {
  const token = localStorage.getItem("auth_token");
  return token;
}

export function getUserId() {
  const user_id = localStorage.getItem("user_id");
  return user_id;
}

// export const clearAuthToken = () => {
//   localStorage.removeItem("auth_token");
//   return redirect("/home");
// };

export const useLikes = () => {
  return useContext(LikesContext);
};

export const getLikeIconColor = (isLikedByUser) => {
  return isLikedByUser ? "red" : "grey";
};
