const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    airtableId: { type: String, index: true },
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
    front: { type: String, required: true },
    back: String,
  },
  {
    timestamps: true,
  },
);

CardSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("Card", CardSchema);
