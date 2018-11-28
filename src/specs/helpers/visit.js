import nightmare from "nightmare";
import url from "url";

const BASE_URL = "http://localhost:3000";

export default function(path = "", query = {}) {
  const location = url.resolve(BASE_URL, path);

  return nightmare().goto(location);
}
