import React from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend, Label } from "recharts";

const ReviewResults = ({ index, cards, location, numCorrect, numIncorrect, onKeepGoing }) => {
  const progressData = [
    { name: "Practiced", value: index },
    { name: "Not started", value: cards.length - index },
  ];

  const progress = Math.round(100 * index / cards.length);
  const isCompleted = index > cards.length - 1;

  return (
    <div className="w-100">
      <h3 className="mb-5 text-center">
        {index <= cards.length - 1 ? "Nice work!" : "You're done!"}
      </h3>
      <div className="row d-flex mb-2">
        <div className="px-5 position-relative col-12 col-lg-6">
          <ResponsiveContainer height={200} width="100%">
            <PieChart>
              <Pie
                data={progressData}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                animationDuration={0}
                startAngle={180}
                endAngle={0}
                fill="#82ca9d"
              >
                <Cell fill="#343a40" />
                <Cell fill="#efefef" />
                <Label
                  className="font-weight-bold"
                  fill="#343a40"
                  position="center"
                  style={{ fontSize: "24px" }}
                  value={`${progress}%`}
                />
              </Pie>
              <Legend className="w-100" verticalAlign="top" height={50} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <span
            className="text-center font-weight-medium position-absolute"
            style={{ right: 0, left: 0, top: "135px" }}
          >
            Progress
          </span>
        </div>
        <div className="px-4" style={{ flexGrow: 1 }}>
          <table className="table w-100">
            <thead>
              <tr>
                <th>Results</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Incorrect Answers</td>
                <td>{numIncorrect}</td>
              </tr>
              <tr>
                <td>Correct Answers</td>
                <td>{numCorrect}</td>
              </tr>
              <tr>
                <td>Total Seen</td>
                <td>{index}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="progress-review-buttons d-flex justify-content-center">
        {!isCompleted ? (
          <div>
            <Link
              to={{ pathname: "/", search: location.search }}
              className="btn btn-outline-dark mr-2 mb-2"
            >
              Go back
            </Link>
            <button className="btn btn-dark mb-2" onClick={onKeepGoing}>
              Press space to continue
            </button>
          </div>
        ) : (
          <Link to={{ pathname: "/", search: location.search }} className="btn btn-dark">
            Go back home
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewResults;
