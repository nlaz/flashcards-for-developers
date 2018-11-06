import axios from "axios";
import queryString from "query-string";

import authAxios from "./utils/authAxios";

/* Search related endpoints */
export const searchContent = search => {
  return authAxios.get(`/api/search?${queryString.stringify({ text: search })}`);
};

/* Deck related endpoints */
export const fetchDeck = id => {
  return authAxios.get(`/api/decks/${id}`);
};

export const deleteDeck = deckId => {
  return authAxios.delete(`/api/decks/${deckId}`);
};

export const updateDeck = ({ deckId, name, description }) => {
  return authAxios.put(`/api/decks/${deckId}`, { name, description });
};

export const createDeck = ({ name, description }) => {
  return authAxios.post("/api/decks", { name, description });
};

export const fetchDecks = collectionId => {
  const params = collectionId ? `?${queryString.stringify({ collection: collectionId })}` : "";
  return authAxios.get(`/api/decks${params}`);
};

/* Collections related endpoints */
export const fetchCollection = id => {
  return authAxios.get(`/api/collections/${id}`);
};

export const fetchCollections = searchStr => {
  const params = searchStr ? `?${queryString.stringify({ search: searchStr })}` : "";
  return authAxios.get(`/api/collections${params}`);
};

// Cards releated endpoints
export const createCard = ({ front, back, deck }) => {
  return authAxios.post("/api/cards", { front, back, deck });
};

export const deleteCard = cardId => {
  return authAxios.delete(`/api/cards/${cardId}`);
};

export const fetchCards = ({ deck, collection, deckIds }) => {
  const params = queryString.stringify({ deck, collection, deckIds });
  return authAxios.get(`/api/cards?${params}`);
};

// Authentication related endpoints
export const loginGithubUser = code => {
  return axios.post("/auth/github/login", { code });
};

export const registerGithubUser = profile => {
  return axios.post("/auth/github/register", { ...profile });
};

// Current user related endpoints
export const submitPayment = ({ description, amount, source, currency }) => {
  return authAxios.post("/users/payments", { description, amount, source, currency });
};

export const fetchPinnedDecks = () => {
  return authAxios.get("/users/pinned_decks");
};

export const fetchUserReviews = userId => {
  return authAxios.get(`/users/${userId}/reviews`);
};

export const fetchProfile = () => {
  return authAxios.get("/users/profile");
};

export const updateProfile = ({ name, email, username, email_notification }) => {
  return authAxios.put(`/users/profile`, { name, email, username, email_notification });
};

export const deleteProfile = () => {
  return authAxios.delete("/users/profile");
};

export const removePinnedDeck = deckId => {
  return authAxios.delete("/users/pinned_decks", { data: { deck: deckId } });
};

export const addPinnedDecks = deckIds => {
  return authAxios.put("/users/pinned_decks", { decks: [...deckIds] });
};

export const togglePinnedDeck = (deckId, isPinned) => {
  return isPinned ? removePinnedDeck(deckId) : addPinnedDecks([deckId]);
};

export const fetchStudySessions = () => {
  return authAxios.get("/users/study_sessions");
};

export const addStudySessions = dates => {
  return authAxios.put("/users/study_sessions", { dates: [...dates] });
};

export const addStudySession = date => addStudySessions([date]);

// User related endpoints
export const fetchDecksForUser = username => {
  return authAxios.get(`/users/${username}/decks`);
};
export const fetchUserPinnedDecks = username => {
  return axios.get(`/users/${username}/pinned_decks`);
};

export const fetchUserActivity = username => {
  return authAxios.get(`/users/${username}/activity`);
};

export const fetchUserStudyProgress = username => {
  return authAxios.get(`/users/${username}/study_progress`);
};

export const fetchUserProfile = userId => {
  return authAxios.get(`/users/${userId}/profile`);
};

// Study progress related endpoints
export const fetchStudyProgress = () => {
  return authAxios.get("/study_progress");
};

export const fetchDeckStudyProgress = deckId => {
  return authAxios.get(`/study_progress/${deckId}`);
};

export const addStudyProgress = progressObjs => {
  return authAxios.put(`/study_progress`, progressObjs);
};

export const addCardProgress = (deckId, cardId, leitnerBox, reviewedAt) => {
  return authAxios.put(`/study_progress/${deckId}/${cardId}`, { leitnerBox, reviewedAt });
};
