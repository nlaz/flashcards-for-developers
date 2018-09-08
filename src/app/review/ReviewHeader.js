import React from "react";
import marked from "marked";

import Octicon from "../../components/Octicon";

const ReviewHeader = ({ deck, className }) => (
  <div className={className}>
    <h1 className="m-0">{deck.name}</h1>
    {deck.description && (
      <div
        className="deck-description mb-2"
        dangerouslySetInnerHTML={{
          __html: marked(deck.description),
        }}
      />
    )}
    {deck.source && (
      <div className="mb-2 d-flex align-items-center">
        <Octicon name="link" className="d-flex mr-1" />
        <a className="truncate" rel="noopener noreferrer" style={{ fontSize: ".9em" }} href={deck.source}>
          {deck.source}
        </a>
      </div>
    )}
  </div>
);

export default ReviewHeader;
