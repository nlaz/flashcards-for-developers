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

export const fetchDecks = async category => {
  const results = {};
  await base("Decks")
    .select({ filterByFormula: `NOT({Category} != '${category.name}' )` })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        const deck = record.get("Name");
        results[record.id] = deck;
      });
      fetchNextPage();
    });
  return results;
};

export const fetchDeck = async id => {
  return new Promise((success, failure) => {
    base("Decks").find(id, function(err, record) {
      if (err) failure(err);

      const result = { id: record.id, name: record.get("Name") };
      success(result);
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
