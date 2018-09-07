import Airtable from "airtable";
import axios from "axios";
import cookie from "js-cookie";
import queryString from "query-string";

import config from "../config/index";

const base = new Airtable({ apiKey: config.airtableApiKey }).base(config.airtableApiId);

export const fetchCollection = id => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get(`/api/collections/${id}`, config);
};

const getDeckFromRecord = record => ({
  id: record.id,
  name: record.get("Name"),
  cards: record.get("Cards"),
  description: record.get("Description"),
  category: record.get("Category") || [],
  type: record.get("Type"),
  source: record.get("Source"),
  difficulty: record.get("Difficulty"),
  stars: record.get("Stars"),
  createdTime: record.get("Created time"),
  upvotes: record.get("Upvotes"),
  downvotes: record.get("Downvotes"),
  new: record.get("New") || false,
});

export const updateDeck = async (deckId, body) => {
  return new Promise((success, failure) => {
    base("Decks").update(deckId, body, function(err, record) {
      if (err) failure(err);

      success(getDeckFromRecord(record));
    });
  });
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

export const setSavedDecks = decks => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/saved_decks", { decks }, config);
};
