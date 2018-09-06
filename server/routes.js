const express = require("express");

const isAuthenticated = require("./middleware/isAuthenticated");
const UserController = require("./controllers/UserController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.post("/auth/github", UserController.githubUser);

router.put("/users/saved_decks", isAuthenticated, UserController.setSavedDecks);

router.get("/users/saved_decks", isAuthenticated, UserController.getSavedDecks);

module.exports = router;
