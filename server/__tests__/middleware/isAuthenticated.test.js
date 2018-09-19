const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../../middleware/isAuthenticated");
const config = require("../../../config");

const server = express();

const mockUser = { name: "Earl", id: "12345" };

jest.mock("../../models/User", () => ({
  findOne: () => Promise.resolve(mockUser),
}));

server.get("/test", isAuthenticated, function(req, res) {
  res.status(200).json({ user: req.user });
});

it("should return forbidden response if token not included", async () => {
  const response = await request(server).get("/test");

  expect(response.status).toBe(400);
});

it("should return forbidden response if token is invalid", async () => {
  const response = await request(server)
    .get("/test")
    .set({ Authorization: "invalid_token" });

  expect(response.status).toBe(401);
});

it("should set authenticated request if token is valid", async () => {
  const token = jwt.sign("test_token", config.sessionSecret);

  const response = await request(server)
    .get("/test")
    .set({ Authorization: token });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ user: mockUser.id });
});
