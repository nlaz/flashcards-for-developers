import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { getStudyProgress, getStudyProficiency } from "../utils/studyProgress";
import ProgressBar from "../../components/ProgressBar";
import Octicon from "../../components/Octicon";

const DeckItem = ({ deck, location, isSaved, onToggleSave }) => {
  const progress = getStudyProgress(deck.id);
  const proficiency = getStudyProficiency(deck.id);
  return (
    <div className="deck-item col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <Link
        to={{
          search: location.search,
          pathname: `/decks/${deck.id}`,
        }}
        className={cx(
          "border rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative",
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
            className={cx("save badge position-absolute align-items-center p-1 text-uppercase", {
              "save-active bg-dark text-white": isSaved,
            })}
            style={{ bottom: "16px", left: "18px" }}
            onClick={e => onToggleSave(e, deck)}
          >
            <Octicon name={isSaved ? "check" : "plus"} className="d-flex align-items-center" />
            {isSaved ? "Saved" : "Save"}
          </button>
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

export default DeckItem;
