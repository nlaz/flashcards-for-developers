import React from "react";
import cx from "classnames";

const styles = {
  progressBar: {
    height: "10px",
    borderRadius: "999px",
    background: "#eeeeee",
    position: "relative",
  },
  progress: {
    height: "10px",
    borderRadius: "999px",
    position: "absolute",
  },
};

const ProgressBar = ({ className, progress, proficiency }) => {
  const subProgress = progress * proficiency;
  return (
    <div className={cx(className, "w-100 d-flex")} style={styles.progressBar}>
      <div style={{ ...styles.progress, width: 100 * progress + "%", background: "#cfcfcf" }} />
      <div className="bg-dark" style={{ ...styles.progress, width: 100 * subProgress + "%" }} />
    </div>
  );
};

export default ProgressBar;
