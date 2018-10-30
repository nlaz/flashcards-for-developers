import React from "react";
import cx from "classnames";

const StudyProgress = ({ index, items, pageSize, pageStart, pageEnd, isFinished, correctness }) => {
  return (
    <div className="d-flex align-items-center">
      {items.slice(pageStart, pageEnd).map((el, key) => (
        <div
          key={key}
          className={cx(
            "border progress-index border-secondary rounded-circle border-width-2 ml-1",
            {
              "bg-success border-success":
                (isFinished && correctness[key]) || (key < index % pageSize && correctness[key]),
              "bg-secondary border-secondary":
                (isFinished && !correctness[key]) || (key < index % pageSize && !correctness[key]),
              "progress-current": key === index || key === index - pageStart,
            },
          )}
        />
      ))}
    </div>
  );
};

export default StudyProgress;
