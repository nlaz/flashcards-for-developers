import Airtable from "airtable";

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

export const fetchCategory = id => {
  return new Promise((success, failure) => {
    base("Categories").find(id, function(err, record) {
      if (err) failure(err);

      const result = { id: record.id, name: record.get("Name") };
      success(result);
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
});

export const fetchDecks = async category => {
  const results = [];
  const filter = category ? `NOT({Category} != '${category.name}' )` : "";
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
  await base("Cards")
    .select({ filterByFormula: `NOT({Deck} != '${deck.name}' )` })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        results.push({ id: record.id, front: record.get("Front"), back: record.get("Back") });
      });
      fetchNextPage();
    });

  return results;
};
