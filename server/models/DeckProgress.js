const mongoose = require("mongoose");

const DeckProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "CardProgress" }],
});

module.exports = {
  Schema: DeckProgressSchema,
  Model: mongoose.model("DeckProgress", DeckProgressSchema),
};
