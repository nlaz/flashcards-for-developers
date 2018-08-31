const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  github_id: { type: String },
  saved_decks: { type: [String] },
});

const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

class UserClass {
  static newUser({ username, password }) {
    return this.create({
      username: username,
      password: generateHash(password),
    });
  }
}

UserSchema.loadClass(UserClass);
UserSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("User", UserSchema);
