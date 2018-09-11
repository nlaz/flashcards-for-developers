const mongoose = require("mongoose");

const UserCardProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  reviewedAt: { type: String },
  leitnerBox: { type: Number },
});

module.exports = {
  Schema: UserCardProgressSchema,
  Model: mongoose.model("UserCardProgress", UserCardProgressSchema),
};
