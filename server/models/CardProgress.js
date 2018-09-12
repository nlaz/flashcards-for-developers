const mongoose = require("mongoose");

const CardProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  reviewedAt: { type: String },
  leitnerBox: { type: Number },
});

module.exports = {
  Schema: CardProgressSchema,
  Model: mongoose.model("CardProgress", CardProgressSchema),
};
