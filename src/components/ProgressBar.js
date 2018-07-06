import React from "react";
import cx from "classnames";
import injectSheet from "react-jss";

const styles = {
  progressBar: {
    height: 10,
    borderRadius: "999px",
    background: "#eeeeee",
  },
  progress: {
    height: 10,
    borderRadius: "999px",
  },
};

const ProgressBar = injectSheet(styles)(({ className, classes, value, total, percent }) => {
  const width = percent !== undefined ? percent : value / total;
  return (
    <div className={cx(classes.progressBar, className, "w-100")}>
      <div className={cx(classes.progress, "bg-dark")} style={{ width: 100 * width + "%" }} />
    </div>
  );
});

export default ProgressBar;
