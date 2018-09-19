const request = require("supertest");

const server = "http://localhost:5000";

it("should return something", async () => {
  const response = await request(server).get("/api/collections");

  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});
