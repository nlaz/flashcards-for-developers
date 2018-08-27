import React from "react";
import cx from "classnames";

const StudyProgress = ({ index, items, pageSize, pageStart, pageEnd, isFinished }) => {
  return (
    <div className="d-flex align-items-end">
      {items.slice(pageStart, pageEnd).map((el, key) => (
        <div
          key={key}
          className={cx("border border-dark rounded-circle border-width-2 ml-1", {
            "bg-dark": isFinished || key < index % pageSize,
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
