import React from "react";
import cx from "classnames";

const DotItem = ({ isCorrect, isIncorrect, active }) => {
  return (
    <div
      className={cx("border progress-index border-secondary rounded-circle border-width-2 ml-1", {
        "bg-success border-success": isCorrect,
        "bg-secondary border-secondary": isIncorrect,
        "progress-current": active,
      })}
    />
  );
};

const StudyProgress = props => {
  const { index, incorrectCards, items, pageStart, pageEnd, correctness } = props;
  const pageCards = items.slice(pageStart, pageEnd);
  const currentCards = [...pageCards, ...incorrectCards];
  return (
    <div className="d-flex align-items-center">
      {currentCards.map((el, key) => (
        <DotItem
          key={key}
          isCorrect={correctness[key]}
          isIncorrect={!correctness[key] && key < index}
          active={key === index}
        />
      ))}
    </div>
  );
};

export default StudyProgress;
