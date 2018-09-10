const mongoose = require("mongoose");

const UserSavedDecksSchema = new mongoose.Schema(
  { decks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck", unique: true }] },
  { _id: false },
);

// Schema is a sub-document and not exported as model
module.exports = UserSavedDecksSchema;
