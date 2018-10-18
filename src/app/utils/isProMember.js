import cookie from "js-cookie";

const isProMember = () => {
  const user = JSON.parse(cookie.get("user")) || {};

  return Object.keys(user).length > 0 && user.user_plan === "pro_monthly";
};

export default isProMember;
