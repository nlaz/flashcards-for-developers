require("./env")();

module.exports = {
  port: process.env.PORT || 5000,
  database: {
    uri: process.env.DATABASE_URI,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  sessionSecret: process.env.SESSION_SECRET || "",
  githubOAuthClientId: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID || "",
  githubOAuthRedirectURI: process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI || "",
  githubOAuthClientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || "",
  airtableApiKey: process.env.REACT_APP_AIRTABLE_API_KEY || "",
  airtableApiId: process.env.REACT_APP_AIRTABLE_API_ID || "",
  hostname: process.env.HOSTNAME || "",
};
