import cookie from "js-cookie";
import jwt from "jsonwebtoken";

const isAuthenticated = () => {
  const token = cookie.get("token");

  if (!token) {
    return false;
  }

  // checks if token is malformed
  try {
    return jwt.decode(token) !== null;
  } catch (error) {
    cookie.remove("token");
    cookie.remove("user");
    return false;
  }
};

export default isAuthenticated;
