const express = require("express");

const isAuthenticated = require("./middleware/isAuthenticated");
const UsersController = require("./controllers/UsersController");
const CardsController = require("./controllers/CardsController");
const DecksController = require("./controllers/DecksController");
const CollectionsController = require("./controllers/CollectionsController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.get("/api/decks", DecksController.getDecks);

router.get("/api/decks/:deckId", DecksController.getDeck);

router.get("/api/collections/:collectionId", CollectionsController.getCollection);

router.get("/api/cards", CardsController.getCards);

router.post("/auth/github", UsersController.getGithubUser);

router.put("/users/saved_decks", isAuthenticated, UsersController.setSavedDecks);

router.get("/users/saved_decks", isAuthenticated, UsersController.getSavedDecks);

router.put("/users/study_sessions", isAuthenticated, UsersController.addStudySession);

router.get("/users/study_sessions", isAuthenticated, UsersController.getStudySessions);

module.exports = router;
