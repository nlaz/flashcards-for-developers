import React from "react";
import cx from "classnames";
import injectSheet from "react-jss";

const styles = {
  progressBar: {
    height: 10,
    borderRadius: "999px",
    background: "#eeeeee",
    position: "relative",
  },
  progress: {
    height: 10,
    borderRadius: "999px",
    position: "absolute",
  },
};

const ProgressBar = injectSheet(styles)(({ className, classes, progress, proficiency }) => {
  const subProgress = progress * proficiency;
  return (
    <div className={cx(classes.progressBar, className, "w-100 d-flex")}>
      <div
        className={cx(classes.progress)}
        style={{ width: 100 * progress + "%", background: "#cfcfcf" }}
      />
      <div className={cx(classes.progress, "bg-dark")} style={{ width: 100 * subProgress + "%" }} />
    </div>
  );
});

export default ProgressBar;
