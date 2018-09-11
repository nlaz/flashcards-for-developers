const mongoose = require("mongoose");

const UserDeckProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
  cards: [
    {
      card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
      reviewedAt: { type: String },
      leitnerBox: { type: Number },
    },
  ],
});

module.exports = {
  Schema: UserDeckProgressSchema,
  Model: mongoose.model("UserDeckProgress", UserDeckProgressSchema),
};
