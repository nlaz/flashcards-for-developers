import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import * as utils from "../utils/studyProgress";
import ProgressBar from "../../components/ProgressBar";
import Octicon from "../../components/Octicon";

const DeckItem = ({ deck, deckProgress, isPinned, onTogglePin }) => {
  const progress = utils.calcStudyProgress(deck, deckProgress);
  const proficiency = utils.calcStudyProficiency(deckProgress);
  const label = isPinned ? "Pinned" : "Pin";

  return (
    <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <Link
        to={`/decks/${deck.id}`}
        className={cx(
          "border bg-white rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative",
          deck.new ? "border-dark" : "border-dark",
        )}
        disabled={!deck.cards}
        style={{
          fontSize: "14px",
          opacity: deck.cards ? 1 : 0.25,
        }}
      >
        <div>
          <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
          {deck.name}
          <button
            className={cx("pin-btn badge position-absolute align-items-center p-1 text-uppercase", {
              "pin-btn-active bg-dark text-white": isPinned,
            })}
            style={{ bottom: "16px", left: "18px" }}
            onClick={e => onTogglePin(e, deck)}
          >
            <Octicon name={isPinned ? "check" : "pin"} className="d-flex align-items-center" />
            {label}
          </button>
          {deck.pro && (
            <div
              className="badge badge-danger ml-2 position-absolute p-1 text-uppercase"
              style={{ bottom: "16px", right: "60px" }}
            >
              Pro
            </div>
          )}
          {deck.new && (
            <div
              className="badge badge-primary ml-2 position-absolute p-1 text-uppercase"
              style={{ bottom: "16px", right: "18px" }}
            >
              New
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

DeckItem.defaultProps = {
  deck: {},
};

export default DeckItem;
