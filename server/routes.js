const express = require("express");

const isAuthenticated = require("./middleware/isAuthenticated");
const UserController = require("./controllers/UserController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.post("/auth/github", UserController.githubUser);

router.put("/users/saved_decks", isAuthenticated, UserController.saveDecks);

router.use((req, res) => {
  return res.status(404).send({
    url: req.originalUrl,
    error: "Not found",
  });
});

router.use((err, req, res, next) => {
  console.log("❌", err.message);
  return res.status(500).send({ error: err.stack });
});

module.exports = router;
