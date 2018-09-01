import React, { Component } from "react";
import pluralize from "pluralize";
import moment from "moment";

import * as utils from "../utils/studyProgress";

const PAST_WEEK = [...new Array(7)];

const EMOJIS = ["🐤", "🐛", "🐙", "⛳️", "👑", "🏆", "🦈", "🦑", "🦖", "🚀"];

const EMOJI = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

const DateColumn = ({ index, sessions }) => {
  const date = moment().subtract(index, "days");
  const hasStudied = sessions.find(el => moment(el).isSame(date, "day"));

  return (
    <div
      key={index}
      className="d-flex flex-column px-1 pt-1 pb-2"
      style={{ backgroundColor: "#EFF0F1", marginLeft: "1px" }}
    >
      <small className="text-secondary mb-1 text-center">{date.format("dd")}</small>
      {hasStudied ? (
        <span className="mt-1 mb-3 text-center">{EMOJI}</span>
      ) : (
        <small className="mt-1 mb-3 text-center" style={{ opacity: 0.5 }}>
          -
        </small>
      )}
    </div>
  );
};

class HabitTracker extends Component {
  state = { sessions: [] };

  componentDidMount() {
    this.fetchStudySessions();
  }

  fetchStudySessions = () => {
    this.setState({ sessions: utils.getStudyHistory() });
  };

  render() {
    const { sessions } = this.state;
    const daysThisWeek = sessions.filter(el => moment(el).isAfter(moment().subtract(7, "days")));

    return (
      <div className="habit-tracker d-flex flex-row-reverse flex-lg-row justify-content-end justify-content-lg-center align-items-center w-100">
        <div className="mx-2">
          <p
            className="m-0 text-uppercase font-weight-medium"
            style={{ fontSize: "14px", lineHeight: "12px" }}
          >
            Past Week
          </p>
          <p className="text-secondary m-0" style={{ fontSize: "14px" }}>
            You studied {pluralize("day", daysThisWeek.length, true)} this week.
          </p>
        </div>
        <div className=" d-flex flex-row-reverse mx-2 habit-tracker_calender">
          {PAST_WEEK.map((_, index) => (
            <DateColumn index={index} key={index} sessions={sessions} />
          ))}
        </div>
      </div>
    );
  }
}

export default HabitTracker;
