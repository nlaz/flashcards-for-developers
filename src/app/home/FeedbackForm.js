import React from "react";
import config from "../../config";

import * as analytics from "../../components/GoogleAnalytics";

const FeedbackForm = () => (
  <div className="feedback-form border border-secondary rounded rounded p-4 text-center bg-light">
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <span>
        Stay tuned! Subscribe for news about new decks, features, and other announcements.{" "}
        <span role="img" aria-label="Tada emoji">
          🎉
        </span>
      </span>
      <div className="mt-3">
        <a
          href={config.mailchimpUrl}
          onClick={() => analytics.logPressedSubscribe()}
          className="btn btn-dark py-2 px-5"
          style={{ borderRadius: "999px" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-bullhorn mr-2" />
          Subscribe!
        </a>
      </div>
    </div>
  </div>
);

export default FeedbackForm;
