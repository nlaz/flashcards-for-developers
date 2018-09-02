import React from "react";
import cx from "classnames";

const StudyProgress = ({ index, items, pageSize, pageStart, pageEnd, isFinished, correctness }) => {
  return (
    <div className="d-flex align-items-end">
      {items.slice(pageStart, pageEnd).map((el, key) => (
        <div
          key={key}
          className={cx("border border-dark rounded-circle border-width-2 ml-1", 
          {
            "bg-dark": (isFinished && correctness[key]) || ((key < index % pageSize) && correctness[key]),
            "bg-danger": (isFinished && !correctness[key]) || ((key < index % pageSize) && !correctness[key]),
          })}
          style={{
            width: "10px",
            height: "10px",
          }}
        />
      ))}
    </div>
  );
};

export default StudyProgress;
