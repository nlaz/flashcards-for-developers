import React from "react";
import cx from "classnames";

const GridSquare = ({ activity }) => (
  <div className={cx("grid-item", { [`grid-item-${activity}`]: activity !== undefined })} />
);

export default GridSquare;
