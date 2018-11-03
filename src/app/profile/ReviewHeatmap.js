import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Tooltip from "rc-tooltip";
import moment from "moment";
import cx from "classnames";

import * as api from "../apiActions";

const NUM_WEEKS = 54;
const NUM_DAYS = 7;
const NUM_DAYS_IN_YEAR = 366;
const oneYearAgo = moment().subtract(NUM_DAYS_IN_YEAR, "days");

const columns = [...Array(NUM_WEEKS)];
const rows = [...Array(NUM_DAYS)];

const Square = ({ activity }) => (
  <div className={cx("grid-item", { [`grid-item-${activity}`]: activity !== undefined })} />
);

const GridItem = ({ count, activity, date }) => {
  if (date.isAfter(moment()) || date.isSameOrBefore(oneYearAgo)) {
    return <div className="grid-item" />;
  }

  const overlay = `${count} reviews on ${moment(date).format("MMM D, YYYY")}`;

  return (
    <Tooltip placement="top" overlay={overlay} mouseEnterDelay={0.1}>
      <div>
        <Square activity={activity} />
      </div>
    </Tooltip>
  );
};

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

function getBoxValues(data) {
  var boxValues = {};
  boxValues.low = Math.min.apply(Math, data);
  boxValues.q1 = getPercentile(data, 25);
  boxValues.median = getPercentile(data, 50);
  boxValues.q3 = getPercentile(data, 75);
  boxValues.high = Math.max.apply(Math, data);
  return boxValues;
}

function getPercentile(data, percentile) {
  data.sort();
  var index = (percentile / 100) * data.length;
  var result;

  if (Math.floor(index) === index) {
    result = (data[index - 1] + data[index]) / 2;
  } else {
    result = data[Math.floor(index)];
  }
  return result;
}

class ReviewHeatmap extends Component {
  state = { reviews: {}, stats: {} };

  componentDidMount() {
    const { userId } = this.props.match.params;
    api
      .fetchUserReviews(userId)
      .then(({ data }) =>
        this.setState({
          reviews: this.formatResponse(data),
          stats: this.getReviewStats(data),
        }),
      )
      .catch(error => console.log(error));
  }

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

  getActivity = (row, col) => {
    const { reviews, stats = {} } = this.state;
    const date = this.getDate(row, col);

    if (date.isAfter(moment()) || date.isSameOrBefore(oneYearAgo)) {
      return;
    }

    const count = reviews[date.format("YYYY-MM-DD")] || 0;
    return this.getBucket(count, stats);
  };

  getCount = (row, col) => {
    const { reviews } = this.state;
    const date = this.getDate(row, col);

    if (date.isAfter(moment()) || date.isSameOrBefore(oneYearAgo)) {
      return;
    }
    return reviews[date.format("YYYY-MM-DD")] || 0;
  };

  getDate = (row, col) => {
    const rowIndex = row + col * NUM_DAYS;
    const gridOffset = oneYearAgo.day();
    const daysSinceToday = NUM_DAYS_IN_YEAR - rowIndex + gridOffset;
    return moment().subtract(daysSinceToday, "days");
  };

  getBucket = (count, stats) => {
    if (count >= stats.q3) {
      return 4;
    } else if (count >= stats.median) {
      return 3;
    } else if (count >= stats.q1) {
      return 2;
    } else if (count > 0 && count <= stats.q1) {
      return 1;
    } else {
      return 0;
    }
  };

  render() {
    return (
      <div className="border rounded" style={{ borderColor: "#e8e8e8", padding: "25px 35px" }}>
        <div className="d-flex flex-column-reverse flex-lg-row justify-content-between mt-2">
          <div className="d-none d-lg-flex align-items-center justify-content-center mb-2">
            <div className="d-flex flex-column text-muted">
              <small className="font-weight-medium">Current Streak</small>
              <small className="font-weight-medium">Longest Streak</small>
              <small className="font-weight-medium">Completion</small>
              <small className="font-weight-medium">Cards Seen</small>
              <small className="font-weight-medium">Cards Mastered</small>
            </div>
            <div className="d-flex flex-column ml-3">
              <small className="font-weight-bold">2 days</small>
              <small className="font-weight-bold">28 days</small>
              <small className="font-weight-bold">25%</small>
              <small className="font-weight-bold">100 cards</small>
              <small className="font-weight-bold">0 cards</small>
            </div>
          </div>
          <div className="graph">
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
                            activity={this.getActivity(rowKey, colKey)}
                            date={this.getDate(rowKey, colKey)}
                            count={this.getCount(rowKey, colKey)}
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
              <Square activity={0} />
              <Square activity={1} />
              <Square activity={2} />
              <Square activity={3} />
              <Square activity={4} />
              <small className="ml-1">More</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ReviewHeatmap);
