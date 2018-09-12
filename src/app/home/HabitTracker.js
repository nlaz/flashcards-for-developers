import React, { Component } from "react";
import pluralize from "pluralize";
import moment from "moment";

import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";
import isAuthenticated from "../utils/isAuthenticated";

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
        <span className="mt-1 mb-2 text-center">{EMOJI}</span>
      ) : (
        <small className="mt-1 mb-2 text-center" style={{ opacity: 0.5 }}>
          -
        </small>
      )}
    </div>
  );
};

class HabitTracker extends Component {
  state = { sessions: [], isError: false };

  componentDidMount() {
    this.fetchStudySessions();
  }

  fetchStudySessions = () => {
    if (isAuthenticated()) {
      api
        .fetchStudySessions()
        .then(
          response => this.setState({ sessions: response.data }),
          error => this.handleError(error),
        );
    } else {
      this.setState({ sessions: localStorage.getStudySessions() });
    }
  };

  handleError = error => {
    console.error(error);
    this.setState({ isError: true });
  };

  render() {
    const { sessions, isError } = this.state;

    if (isError) {
      return (
        <div className="container container--narrow px-0">
          <div className="text-center p-4">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const daysThisWeek = sessions.filter(el => moment(el).isAfter(moment().subtract(7, "days")));

    return (
      <div className="d-sm-flex flex-row-reverse flex-lg-row justify-content-end justify-content-lg-center align-items-center text-center text-sm-left w-100">
        <div className="mx-2 mb-1">
          <p
            className="m-0 text-uppercase font-weight-medium"
            style={{ fontSize: "12px", lineHeight: "12px" }}
          >
            Past Week
          </p>
          <p className="text-secondary m-0" style={{ fontSize: "12px" }}>
            You studied {pluralize("day", daysThisWeek.length, true)} this week.
          </p>
        </div>
        <div className=" d-flex flex-row-reverse mx-2 justify-content-center">
          {PAST_WEEK.map((_, index) => (
            <DateColumn index={index} key={index} sessions={sessions} />
          ))}
        </div>
      </div>
    );
  }
}

export default HabitTracker;
