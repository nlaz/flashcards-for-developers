const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema(
  {
    airtableId: { type: String, index: true },
    name: String,
    type: String,
    source: String,
    description: String,
    cards: [String],
    difficulty: [String],
    stars: Number,
    createdTime: String,
    upvotes: Number,
    downvotes: Number,
    new: Boolean,
  },
  {
    timestamps: true,
  },
);

DeckSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("Deck", DeckSchema);
