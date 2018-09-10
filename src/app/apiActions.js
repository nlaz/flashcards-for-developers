import axios from "axios";
import cookie from "js-cookie";
import queryString from "query-string";

export const fetchCollection = id => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/api/collections/${id}`, config);
};

export const fetchDecks = collectionId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = collectionId ? "?" + queryString.stringify({ collection: collectionId }) : "";
  return axios.get(`/api/decks${params}`, config);
};

export const fetchDeck = id => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/api/decks/${id}`, config);
};

export const fetchCards = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/api/cards?deck=${deckId}`, config);
};

export const loginUser = params => {
  return axios.post("/auth/login", params);
};

export const signupUser = params => {
  return axios.post("/auth/signup", params);
};

export const githubUser = code => {
  return axios.post("/auth/github", { code });
};

export const fetchSavedDecks = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/saved_decks", config);
};

export const removeSavedDeck = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.delete("/users/saved_decks", { ...config, data: { deck: deckId } });
};

export const addSavedDeck = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/saved_decks", { deck: deckId }, config);
};

export const toggleSavedDeck = (deckId, isSaved) => {
  return isSaved ? removeSavedDeck(deckId) : addSavedDeck(deckId);
};

export const fetchStudyHistory = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/study_sessions", config);
};

export const addStudyHistory = date => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/study_sessions", { date }, config);
};
