const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    airtableId: { type: String, index: true },
    decks: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }], select: false },
    emoji: String,
    color: String,
    order: Number,
  },
  {
    timestamps: true,
  },
);

CollectionSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("Collection", CollectionSchema);
