const mongoose = require("mongoose");

const UserStudySessionsSchema = new mongoose.Schema(
  { dates: { type: [String], default: [] } },
  { _id: false },
);

// Schema is a sub-document and not exported as model
module.exports = UserStudySessionsSchema;
