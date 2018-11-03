import React, { Component } from "react";
import Tooltip from "rc-tooltip";
import moment from "moment";

import GridSquare from "./GridSquare";

const NUM_DAYS_IN_YEAR = 366;
const NUM_DAYS = 7;
const oneYearAgo = moment().subtract(NUM_DAYS_IN_YEAR, "days");

class GridItem extends Component {
  getDate = (row, col) => {
    const rowIndex = row + col * NUM_DAYS;
    const gridOffset = oneYearAgo.day();
    const daysSinceToday = NUM_DAYS_IN_YEAR - rowIndex + gridOffset;
    return moment().subtract(daysSinceToday, "days");
  };

  getCount = date => {
    const { reviews } = this.props;

    if (date.isAfter(moment()) || date.isSameOrBefore(oneYearAgo)) {
      return;
    }
    return reviews[date.format("YYYY-MM-DD")] || 0;
  };

  getBucket = count => {
    const { stats } = this.props;
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
    const { row, col } = this.props;

    const date = this.getDate(row, col);
    const count = this.getCount(date);
    const bucket = this.getBucket(count);

    if (date.isAfter(moment()) || date.isSameOrBefore(oneYearAgo)) {
      return <GridSquare />;
    }

    const overlay = `${count} reviews on ${moment(date).format("MMM D, YYYY")}`;

    return (
      <Tooltip placement="top" overlay={overlay} mouseEnterDelay={0.1}>
        <div>
          <GridSquare activity={bucket} />
        </div>
      </Tooltip>
    );
  }
}

export default GridItem;
