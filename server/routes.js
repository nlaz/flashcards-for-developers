const express = require("express");

const getUser = require("./middleware/getUser");
const isAuthenticated = require("./middleware/isAuthenticated");
const UsersController = require("./controllers/UsersController");
const CardsController = require("./controllers/CardsController");
const DecksController = require("./controllers/DecksController");
const ProgressController = require("./controllers/ProgressController");
const CollectionsController = require("./controllers/CollectionsController");
const SearchController = require("./controllers/SearchController");

const router = express.Router();

router.get("/hello", (req, res) => res.send({ message: "Hello world!" }));

// Search related endpoints
router.get("/api/search", SearchController.searchContent);

// Deck related endpoints
router.get("/api/decks", DecksController.getDecks);
router.post("/api/decks", isAuthenticated, DecksController.createDeck);
router.get("/api/decks/:deckId", getUser, DecksController.getDeck);
router.put("/api/decks/:deckId", isAuthenticated, DecksController.updateDeck);
router.delete("/api/decks/:deckId", isAuthenticated, DecksController.deleteDeck);

// Collections related endpoints
router.get("/api/collections", CollectionsController.getCollections);
router.get("/api/collections/:collectionId", CollectionsController.getCollection);

// Cards related endpoints
router.get("/api/cards", getUser, CardsController.getCards);
router.post("/api/cards", isAuthenticated, CardsController.createCard);
router.delete("/api/cards/:cardId", isAuthenticated, CardsController.deleteCard);

// Authentication related endpoints
router.post("/auth/github/login", UsersController.getGithubUser);
router.post("/auth/github/register", UsersController.createGithubUser);

// Current user related endpoints
router.post("/users/payments", isAuthenticated, UsersController.postStripeCharge);

router.get("/users/pinned_decks", isAuthenticated, UsersController.getPinnedDecks);
router.put("/users/pinned_decks", isAuthenticated, UsersController.addPinnedDecks);
router.delete("/users/pinned_decks", isAuthenticated, UsersController.removePinnedDeck);

router.put("/users/profile", isAuthenticated, UsersController.updateUserProfile);
router.delete("/users/profile", isAuthenticated, UsersController.deleteUserProfile);

router.get("/users/study_sessions", isAuthenticated, UsersController.getStudySessions);
router.put("/users/study_sessions", isAuthenticated, UsersController.addStudySessions);

// User related endpoints
router.get("/users/:userId/reviews", isAuthenticated, UsersController.getUserReviews);
router.get("/users/:userId/activity", isAuthenticated, UsersController.getUserActivity);

router.get("/users/:username/decks", DecksController.getDecksForUser);
router.get("/users/:username/profile", UsersController.getUserProfile);
router.get("/users/:username/pinned_decks", UsersController.getUserPinnedDecks);
router.get("/users/:username/study_progress", ProgressController.getStudyProgress);

// Study progress related endpoints
router.get("/study_progress", isAuthenticated, ProgressController.getStudyProgress);
router.put("/study_progress", isAuthenticated, ProgressController.addStudyProgress);
router.get("/study_progress/:deckId", isAuthenticated, ProgressController.getDeckProgress);
router.put("/study_progress/:deckId/:cardId", isAuthenticated, ProgressController.addCardProgress);

module.exports = router;
