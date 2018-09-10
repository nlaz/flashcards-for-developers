const mongoose = require("mongoose");

const UserStudySessionsSchema = require("./UserStudySessions");
const UserSavedDecksSchema = require("./UserSavedDecks");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  github_id: { type: String },
  saved_decks: {
    type: UserSavedDecksSchema,
    default: UserSavedDecksSchema,
    select: false,
  },
  study_sessions: {
    type: UserStudySessionsSchema,
    default: UserStudySessionsSchema,
    select: false,
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
});

// Added to prevent mongoose deprecation errors
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model("User", UserSchema);
