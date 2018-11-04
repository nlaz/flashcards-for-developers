import React from "react";

// Component used to deal with a11y requirements
const Emoji = ({ value, label = "" }) => (
  <span role="img" aria-label={label}>
    {value}
  </span>
);

export default Emoji;
