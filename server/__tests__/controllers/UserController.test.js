const request = require("supertest");

const server = "http://localhost:5000";

it("should return something", async () => {
  const response = await request(server).get("/users/saved_decks");

  expect(response.status).toBe(400);
});
