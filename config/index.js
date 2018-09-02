require("./env")();

module.exports = {
  port: process.env.PORT || 5000,
  database: {
    uri: process.env.DATABASE_URI,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  sessionSecret: process.env.SESSION_SECRET || "",
};
