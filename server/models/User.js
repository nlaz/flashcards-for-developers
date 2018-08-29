const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
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

mongoose.set("useCreateIndex", true);
module.exports = mongoose.model("User", UserSchema);
