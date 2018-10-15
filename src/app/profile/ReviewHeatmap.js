import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const NUM_WEEKS = 52;
const NUM_DAYS = 7;
const NUM_DAYS_IN_YEAR = NUM_WEEKS * NUM_DAYS;
const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const columns = [...Array(NUM_WEEKS)];
const rows = [...Array(NUM_DAYS)];

const GridItem = ({ activity }) => {
  return <div className={`grid-item grid-item-${activity}`} style={{}} />;
};

const YAxis = () => (
  <div className="d-flex flex-column text-muted mr-1">
    <div className="grid-label-x" />
    {rows.map((_, key) => (
      <span className="grid-label-y">
        {key % 2 === 1 &&
          moment()
            .subtract(key, "days")
            .format("ddd")}
      </span>
    ))}
  </div>
);

const XAxis = () => (
  <div className="d-flex flex-row-reverse text-muted mr-1">
    {columns.map((_, key) => (
      <span className="grid-label-x">
        {key % 4 === 2 &&
          moment()
            .subtract(key, "weeks")
            .format("MMM")}
      </span>
    ))}
  </div>
);

class ReviewHeatmap extends Component {
  getActivity = ({ row, col }) => Math.floor(Math.random() * 5);

  render() {
    return (
      <div className="border rounded" style={{ borderColor: "#e8e8e8", padding: "25px 35px" }}>
        <div className="d-flex justify-content-between mt-2">
          <div className="d-flex align-items-center mb-2">
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
                          <GridItem activity={this.getActivity(rowKey, colKey)} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="graph-footer d-flex justify-content-end align-items-center mt-2">
              <small className="mr-1">Less</small>
              <GridItem activity={0} />
              <GridItem activity={1} />
              <GridItem activity={2} />
              <GridItem activity={3} />
              <GridItem activity={4} />
              <small className="ml-1">More</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewHeatmap;
