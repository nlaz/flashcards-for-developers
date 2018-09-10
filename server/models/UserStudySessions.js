const mongoose = require("mongoose");

const UserStudySessionsSchema = new mongoose.Schema(
  {
    dates: { type: [String], default: [] },
  },
  {
    _id: false,
  },
);

module.exports = {
  schema: UserStudySessionsSchema,
  model: mongoose.model("UserStudySessions", UserStudySessionsSchema),
};
