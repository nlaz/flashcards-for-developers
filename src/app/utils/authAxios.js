import axios from "axios";
import cookie from "js-cookie";

const authAxios = axios.create();

authAxios.interceptors.request.use(config => {
  const token = cookie.get("token");
  config.headers.Authorization = token;
  return config;
});

export default authAxios;
