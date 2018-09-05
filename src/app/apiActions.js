import Airtable from "airtable";
import axios from "axios";
import cookie from "js-cookie";

import config from "../config/index";

const base = new Airtable({ apiKey: config.airtableApiKey }).base(config.airtableApiId);

export const fetchCategories = async () => {
  const results = [];
  await base("Categories")
    .select()
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        const name = record.get("Name");
        const decks = record.get("Decks");
        results.push({ id: record.id, name, decks });
      });
      fetchNextPage();
    });
  return results;
};

export const fetchCollection = id => {
  return new Promise((success, failure) => {
    base("Categories").find(id, function(err, record) {
      if (err) return failure(err);
      if (!record) return failure(err);

      return success({
        id: record.id,
        name: record.get("Name"),
        description: record.get("Description"),
      });
    });
  });
};

const getDeckFromRecord = record => ({
  id: record.id,
  name: record.get("Name"),
  cards: record.get("Cards"),
  description: record.get("Description"),
  category: (record.get("Category") || [])[0],
  type: record.get("Type"),
  source: record.get("Source"),
  difficulty: record.get("Difficulty"),
  stars: record.get("Stars"),
  createdTime: record.get("Created time"),
  upvotes: record.get("Upvotes"),
  downvotes: record.get("Downvotes"),
  new: record.get("New") || false,
});

export const fetchDecks = async collection => {
  const results = [];
  const filter = collection ? `FIND("${collection.name}", {Category})` : "";
  await base("Decks")
    .select({ filterByFormula: filter })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        results.push(getDeckFromRecord(record));
      });
      fetchNextPage();
    });
  return results;
};

export const fetchDeck = async id => {
  return new Promise((success, failure) => {
    base("Decks").find(id, function(err, record) {
      if (err) failure(err);
      if (record === undefined) {
        return failure(new Error("Record does not exist"));
      }
      success(getDeckFromRecord(record));
    });
  });
};

export const updateDeck = async (deckId, body) => {
  return new Promise((success, failure) => {
    base("Decks").update(deckId, body, function(err, record) {
      if (err) failure(err);

      success(getDeckFromRecord(record));
    });
  });
};

export const fetchCards = async deck => {
  const results = [];
  const filterByFormula = deck.name.includes(",")
    ? `({Deck} = '"${deck.name}"')`
    : `({Deck} = '${deck.name}')`;
  await base("Cards")
    .select({ filterByFormula })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        results.push({ id: record.id, front: record.get("Front"), back: record.get("Back") });
      });
      fetchNextPage();
    });

  return results;
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

export const setSavedDecks = decks => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.put("/users/saved_decks", { decks }, config);
};

export const fetchSavedDecks = () => {
  const config = { headers: { Authorization: cookie.get("token") } };
  return axios.get("/users/saved_decks", config);
};
