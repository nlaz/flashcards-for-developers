import axios from "axios";
import cookie from "js-cookie";
import queryString from "query-string";

export const loginGithubUser = code => {
  return axios.post("/auth/github/login", { code });
};

export const registerGithubUser = profile => {
  return axios.post("/auth/github/register", { ...profile });
};

export const fetchCollections = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/api/collections", config);
};

export const searchCollections = searchStr => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = searchStr ? `?${queryString.stringify({ search: searchStr })}` : "";
  return axios.get(`/api/collections${params}`, config);
};

export const fetchCollection = id => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/api/collections/${id}`, config);
};

export const fetchDecks = collectionId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = collectionId ? `?${queryString.stringify({ collection: collectionId })}` : "";
  return axios.get(`/api/decks${params}`, config);
};

export const fetchDecksById = deckIds => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = deckIds.length > 0 ? `?${queryString.stringify({ ids: deckIds.join(",") })}` : "";
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

export const fetchStudySessions = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/study_sessions", config);
};

export const addStudySession = date => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/study_sessions", { date }, config);
};

export const fetchStudyProgress = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/study_progress", config);
};

export const fetchDeckStudyProgress = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/study_progress/${deckId}`, config);
};

export const addStudyProgress = (deckId, cardId, leitnerBox, reviewedAt) => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = { leitnerBox, reviewedAt };

  return axios.put(`/study_progress/${deckId}/${cardId}`, params, config);
};
