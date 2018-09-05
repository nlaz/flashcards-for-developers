const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  github_id: { type: String },
  saved_decks: { type: [String], select: false },
});

UserSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("User", UserSchema);
