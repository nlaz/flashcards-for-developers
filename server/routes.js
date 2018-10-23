const express = require("express");

const getUser = require("./middleware/getUser");
const isAuthenticated = require("./middleware/isAuthenticated");
const UsersController = require("./controllers/UsersController");
const CardsController = require("./controllers/CardsController");
const DecksController = require("./controllers/DecksController");
const ProgressController = require("./controllers/ProgressController");
const CollectionsController = require("./controllers/CollectionsController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

router.get("/api/decks", DecksController.getDecks);
router.post("/api/decks", isAuthenticated, DecksController.createDeck);
router.get("/api/decks/:deckId", DecksController.getDeck);
router.put("/api/decks/:deckId", isAuthenticated, DecksController.updateDeck);

router.get("/api/collections", CollectionsController.getCollections);
router.get("/api/collections/:collectionId", CollectionsController.getCollection);

router.get("/api/cards", getUser, CardsController.getCards);
router.post("/api/cards", isAuthenticated, CardsController.createCard);
router.delete("/api/cards/:cardId", isAuthenticated, CardsController.deleteCard);

router.post("/auth/github/login", UsersController.getGithubUser);
router.post("/auth/github/register", UsersController.createGithubUser);

router.get("/users/pinned_decks", isAuthenticated, UsersController.getPinnedDecks);
router.put("/users/pinned_decks", isAuthenticated, UsersController.addPinnedDecks);
router.delete("/users/pinned_decks", isAuthenticated, UsersController.removePinnedDeck);
router.post("/users/subscriptions", isAuthenticated, UsersController.subscribeUser);
router.post("/users/payments", isAuthenticated, UsersController.postStripeCharge);

router.get("/users/study_sessions", isAuthenticated, UsersController.getStudySessions);
router.put("/users/study_sessions", isAuthenticated, UsersController.addStudySessions);

router.get("/study_progress", isAuthenticated, ProgressController.getStudyProgress);
router.put("/study_progress", isAuthenticated, ProgressController.addStudyProgress);
router.get("/study_progress/:deckId", isAuthenticated, ProgressController.getDeckProgress);
router.put("/study_progress/:deckId/:cardId", isAuthenticated, ProgressController.addCardProgress);

module.exports = router;
