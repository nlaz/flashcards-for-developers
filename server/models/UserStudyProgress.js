const mongoose = require("mongoose");

const UserStudyProgressSchema = new mongoose.Schema(
  {
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
    reviewedAt: { type: String },
    leitnerBox: { type: Number },
  },
  { _id: false },
);

// Schema is a sub-document and not exported as model
module.exports = UserStudyProgressSchema;
