import React from "react";
import "./Toggle.css";

const Toggle = ({ onClick }) => (
  <label className="switch m-0">
    <input onClick={onClick} type="checkbox" />
    <span className="slider round" />
  </label>
);

export default Toggle;
