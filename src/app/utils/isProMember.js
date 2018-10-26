import cookie from "js-cookie";

const isProMember = () => {
  let user;

  try {
    user = JSON.parse(cookie.get("user")) || {};
  } catch (error) {
    // user isn't authenticated
    return false;
  }

  return Object.keys(user).length > 0 && user.user_plan === "pro_monthly";
};

export default isProMember;
