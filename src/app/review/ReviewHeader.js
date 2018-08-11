import React from "react";
import marked from "marked";

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
      <div className="mb-2">
        <a href={deck.source}>{deck.source}</a>
      </div>
    )}
  </div>
);

export default ReviewHeader;
