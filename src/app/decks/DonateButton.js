import React from "react";
import config from "../../config";

const DonateButton = ({ onClick }) => (
  <div className="donate-button border border-secondary rounded rounded p-4 text-center bg-light">
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <span>
        Do you enjoy this content and want to enable more of it? Your donations can help Flashcards for Developers grow to create more decks, better features, promote community!{" "}
        <span role="img" aria-label="Tada emoji">
        ❤️
        </span>
      </span>
      <div className="mt-3">
        <a
          href={config.airtableFeedbackUrl}
          onClick={onClick}
          className="btn btn-dark py-2"
          style={{ borderRadius: "999px" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-gift mr-2" />
          Donate
        </a>
      </div>
    </div>
  </div>
);

export default DonateButton;
