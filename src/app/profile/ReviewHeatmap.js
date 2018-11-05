import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import * as api from "../apiActions";
import GridItem from "./GridItem";
import GridSquare from "./GridSquare";

const NUM_WEEKS = 54;
const NUM_DAYS = 7;
// const NUM_DAYS_IN_YEAR = 366;
// const oneYearAgo = moment().subtract(NUM_DAYS_IN_YEAR, "days");

const columns = [...Array(NUM_WEEKS)];
const rows = [...Array(NUM_DAYS)];

const YAxis = () => (
  <div className="d-flex flex-column text-muted mr-1">
    <div className="grid-label-x" />
    {rows.map((_, key) => (
      <span className="grid-label-y" key={key}>
        {key % 2 === 1 &&
          moment()
            .day(key)
            .format("ddd")}
      </span>
    ))}
  </div>
);

const XAxis = () => (
  <div className="d-flex flex-row-reverse text-muted mr-1">
    {columns.map((_, key) => (
      <span className="grid-label-x" key={key}>
        {key % 4 === 2 &&
          moment()
            .subtract(key, "weeks")
            .format("MMM")}
      </span>
    ))}
  </div>
);

const getBoxValues = data => ({
  low: Math.min.apply(Math, data),
  q1: getPercentile(data, 0.25),
  median: getPercentile(data, 0.5),
  q3: getPercentile(data, 0.75),
  high: Math.max.apply(Math, data),
});

const getPercentile = (data, percentile) => {
  let result = [...data].sort((a, b) => a - b);
  const index = percentile * result.length;

  if (Math.floor(index) === index) {
    result = (result[index - 1] + result[index]) / 2;
  } else {
    result = result[Math.floor(index)];
  }
  return result;
};

class ReviewHeatmap extends Component {
  state = { reviews: {}, stats: {}, activity: {} };

  componentDidMount() {
    const { username } = this.props.match.params;
    this.fetchUserReviews(username);
    this.fetchUserActivity(username);
  }

  // Helper functions
  formatResponse = data => {
    return data.reduce((obj, item) => {
      obj[item["_id"]] = item.count;
      return obj;
    }, {});
  };

  getReviewStats = data => {
    const counts = data.map(el => el.count);
    return getBoxValues(counts);
  };

  // API functions
  fetchUserReviews = username => {
    api.fetchUserReviews(username).then(({ data }) => {
      const stats = this.getReviewStats(data);
      const reviews = this.formatResponse(data);
      this.setState({ reviews, stats });
    });
  };

  fetchUserActivity = username => {
    api.fetchUserActivity(username).then(({ data }) => {
      this.setState({ activity: data });
    });
  };

  render() {
    const { activity } = this.state;
    return (
      <div className="border rounded" style={{ borderColor: "#e8e8e8", padding: "25px 35px" }}>
        <div className="d-flex flex-column-reverse flex-lg-row justify-content-between mt-2">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <div className="d-flex flex-column text-muted">
              <small className="font-weight-medium">Current Streak</small>
              <small className="font-weight-medium">Longest Streak</small>
              <small className="font-weight-medium">Cards Seen</small>
              <small className="font-weight-medium">Cards Mastered</small>
            </div>
            <div className="d-flex flex-column ml-3">
              <small className="font-weight-bold">{activity.current_streak || 0} days</small>
              <small className="font-weight-bold">{activity.longest_streak || 0} days</small>
              <small className="font-weight-bold">{activity.cards_seen || 0} cards</small>
              <small className="font-weight-bold">{activity.mastered_cards || 0} cards</small>
            </div>
          </div>
          <div className="d-none d-lg-block graph">
            <div className="graph-body d-flex">
              <YAxis />
              <div className="d-flex flex-column">
                <XAxis />
                <div className="d-flex">
                  {columns.map((_, colKey) => (
                    <div className={`col-item col-item-${colKey}`} key={colKey}>
                      {rows.map((_, rowKey) => (
                        <div className={`row-item row-item-${rowKey}`} key={rowKey}>
                          <GridItem
                            row={rowKey}
                            col={colKey}
                            reviews={this.state.reviews}
                            stats={this.state.stats}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="graph-footer d-flex justify-content-end align-items-center mt-2">
              <small className="mr-1">Less</small>
              <GridSquare activity={0} />
              <GridSquare activity={1} />
              <GridSquare activity={2} />
              <GridSquare activity={3} />
              <GridSquare activity={4} />
              <small className="ml-1">More</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ReviewHeatmap);
