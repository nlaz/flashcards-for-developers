const express = require("express");

const isAuthenticated = require("./middleware/isAuthenticated");
const UsersController = require("./controllers/UsersController");
const CardsController = require("./controllers/CardsController");
const DecksController = require("./controllers/DecksController");
const ProgressController = require("./controllers/ProgressController");
const CollectionsController = require("./controllers/CollectionsController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.get("/api/decks", DecksController.getDecks);

router.get("/api/decks/:deckId", DecksController.getDeck);

router.get("/api/collections", CollectionsController.getCollections);
router.get("/api/collections/:collectionId", CollectionsController.getCollection);

router.get("/api/cards", CardsController.getCards);

router.post("/auth/github/login", UsersController.getGithubUser);
router.post("/auth/github/register", UsersController.createGithubUser);

router.get("/users/saved_decks", isAuthenticated, UsersController.getSavedDecks);
router.put("/users/saved_decks", isAuthenticated, UsersController.addSavedDeck);
router.delete("/users/saved_decks", isAuthenticated, UsersController.removeSavedDeck);

router.get("/users/study_sessions", isAuthenticated, UsersController.getStudySessions);
router.put("/users/study_sessions", isAuthenticated, UsersController.addStudySession);

router.get("/study_progress", isAuthenticated, ProgressController.getProgress);
router.get("/study_progress/:deckId", isAuthenticated, ProgressController.getDeckProgress);
router.put("/study_progress/:deckId/:cardId", isAuthenticated, ProgressController.addProgress);

module.exports = router;
