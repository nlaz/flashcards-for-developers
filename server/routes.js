const express = require("express");

const isAuthenticated = require("./middleware/isAuthenticated");
const UsersController = require("./controllers/UsersController");
const CardsController = require("./controllers/CardsController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.get("/api/cards", CardsController.getCards);

router.post("/auth/github", UsersController.githubUser);

router.put("/users/saved_decks", isAuthenticated, UsersController.setSavedDecks);

router.get("/users/saved_decks", isAuthenticated, UsersController.getSavedDecks);

module.exports = router;
