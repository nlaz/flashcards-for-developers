const Airtable = require("airtable");
const mongoose = require("mongoose");

const Card = require("../server/models/Card");
const Deck = require("../server/models/Deck");
const config = require("../config/index");

const base = new Airtable({ apiKey: config.airtableApiKey }).base(config.airtableApiId);

require("../database/index")();
mongoose.set("useFindAndModify", false);

const getCardFromRecord = record => ({
  airtableId: record.id,
  front: record.get("Front"),
  back: record.get("Back"),
  deckAirtableId: (record.get("Deck") || [])[0],
});

// Fetches 'Card' records from Airtable
const fetchCards = async () => {
  const results = [];
  await base("Cards")
    .select()
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        results.push(getCardFromRecord(record));
      });
      fetchNextPage();
    });

  return results;
};

// Creates copy of record in the database
const writeCardsToDatabase = async cards => {
  cards.forEach(async card => {
    const deck = (await Deck.findOne({ airtableId: card.deckAirtableId })) || {};
    const { deckAirtableId, ...rest } = card;
    await Card.findOneAndUpdate(
      { airtableId: card.airtableId },
      { ...rest, deck: deck._id },
      { upsert: true },
    );
  });

  return await Card.countDocuments();
};

async function sync_cards_to_database() {
  try {
    const cards = await fetchCards();

    const cardsCount = await writeCardsToDatabase(cards);

    console.log("Success! Number of cards written: ", cardsCount);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

sync_cards_to_database();
