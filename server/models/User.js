const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  github_id: { type: String },
  // TODO: move these objects out of user model later
  saved_decks: { type: [String], select: false },
  study_history: { type: [String], select: false },
});

UserSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("User", UserSchema);
