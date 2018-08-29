const fs = require("fs");
const dotenv = require("dotenv");

const paths = require("./paths");

module.exports = () => {
  const { NODE_ENV } = process.env;
  if (!NODE_ENV) {
    throw new Error("The NODE_ENV environment variable is required but was not specified.");
  }

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  const dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== "test" && `${paths.dotenv}.local`,
    paths.dotenv,
  ].filter(Boolean);

  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set.
  // https://github.com/motdotla/dotenv
  dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      dotenv.config({
        path: dotenvFile,
      });
    }
  });
};
