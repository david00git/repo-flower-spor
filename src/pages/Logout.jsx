import { logoutUser } from "../services/auth";
import { redirect } from "react-router-dom";

export function action({ setIsLoggedIn }) {
  logoutUser(setIsLoggedIn);

  return redirect("/");
}
