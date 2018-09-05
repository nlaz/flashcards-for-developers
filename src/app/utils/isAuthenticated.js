import cookie from "js-cookie";
import jwt from "jsonwebtoken";

const isAuthenticated = () => {
  const token = cookie.get("token");

  if (!token) {
    return false;
  }

  // checks if token is malformed
  try {
    jwt.decode(token);
  } catch (error) {
    cookie.remove("token");
    cookie.remove("user");
    return false;
  }
  return true;
};

export default isAuthenticated;
