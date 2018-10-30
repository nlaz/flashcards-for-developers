const configs = {
  airtableReportUrl: process.env.REACT_APP_AIRTABLE_REPORT_URL || "",
  airtableFeedbackUrl: process.env.REACT_APP_AIRTABLE_FEEDBACK_URL || "",
  airtableSuggestionsUrl: process.env.REACT_APP_AIRTABLE_SUGGESTIONS_URL || "",
  airtableEmailUrl: process.env.REACT_APP_AIRTABLE_EMAIL_URL || "",
  mixpanelAnalyticsKey: process.env.REACT_APP_MIXPANEL_ANALYTICS_KEY || "",
  googleAnalyticsKey: process.env.REACT_APP_GOOGLE_ANALYTICS_KEY || "",
  mailchimpUrl: process.env.REACT_APP_AIRTABLE_MAILCHIMP_URL || "",
  buyMeACoffeeDonateUrl: process.env.REACT_APP_DONATE_URL || "",
  githubOAuthClientId: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID || "",
  githubOAuthRedirectURI: process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI || "",
  stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "",
};

export default configs;
