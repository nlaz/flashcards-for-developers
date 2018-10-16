const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema(
  {
    airtableId: { type: String, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    status: { type: String, enum: ["private", "public"], default: "public" },
    name: String,
    type: { type: String, default: "Self graded" },
    source: String,
    description: String,
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
