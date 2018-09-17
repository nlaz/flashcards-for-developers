import cookie from "js-cookie";
import jwt from "jsonwebtoken";

import isAuthenticated from "../isAuthenticated";

it("should return false if no cookies set", () => {
  expect(isAuthenticated()).toBe(false);
});
it("should return false if token is set but malformed", () => {
  cookie.set("token", { foo: "bar" });

  expect(isAuthenticated()).toBe(false);
});
it("should return true if token is set and valid", () => {
  cookie.set("token", jwt.sign({ foo: "bar" }, "secret"));

  expect(isAuthenticated()).toBe(true);
});
