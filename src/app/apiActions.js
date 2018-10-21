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

export const fetchCards = ({ deck, collection, deckIds }) => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = queryString.stringify({ deck, collection, deckIds });
  return axios.get(`/api/cards?${params}`, config);
};

export const fetchPinnedDecks = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/pinned_decks", config);
};

export const removePinnedDeck = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.delete("/users/pinned_decks", { ...config, data: { deck: deckId } });
};

export const addPinnedDecks = deckIds => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/pinned_decks", { decks: [...deckIds] }, config);
};

export const togglePinnedDeck = (deckId, isPinned) => {
  return isPinned ? removePinnedDeck(deckId) : addPinnedDecks([deckId]);
};

export const fetchStudySessions = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/study_sessions", config);
};

export const addStudySessions = dates => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/study_sessions", { dates: [...dates] }, config);
};

export const subscribeUser = email => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.post("/users/subscriptions", { email }, config);
};

export const addStudySession = date => addStudySessions([date]);

export const fetchStudyProgress = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/study_progress", config);
};

export const fetchDeckStudyProgress = deckId => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/study_progress/${deckId}`, config);
};

export const addStudyProgress = progressObjs => {
  const config = { headers: { Authorization: cookie.get("token") } };

  return axios.put(`/study_progress`, progressObjs, config);
};

export const addCardProgress = (deckId, cardId, leitnerBox, reviewedAt) => {
  const config = { headers: { Authorization: cookie.get("token") } };
  const params = { leitnerBox, reviewedAt };

  return axios.put(`/study_progress/${deckId}/${cardId}`, params, config);
};

export const submitPayment = ({ description, amount, source, currency }) => {
  const config = { headers: { Authorization: cookie.get("token") } };

  return axios.post("/users/payments", { description, amount, source, currency }, config);
};
