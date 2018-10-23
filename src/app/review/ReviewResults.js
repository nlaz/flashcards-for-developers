import React from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip, Legend, Label } from "recharts";
import isAuthenticated from "../utils/isAuthenticated";
import * as leitner from "../../spaced/leitner";
import LoginPrompt from "./LoginPrompt";

const ReviewResults = ({
  index,
  cards,
  numCorrect,
  numIncorrect,
  cardProgress,
  onKeepGoing,
  onGoBack,
}) => {
  const progressData = [
    { name: "Practiced", value: index || 1 },
    { name: "Not started", value: cards.length - index },
  ];

  const progress = Math.round((100 * index) / cards.length) || 100;
  const isCompleted = index > cards.length - 1;
  const authenticated = isAuthenticated();
  const daysUntilDeckProgressIsExpired =
    cardProgress.reduce((avg, cardObj) => {
      return leitner.getDaysUntilExpired(cardObj.leitnerBox, cardObj.reviewedA) + avg;
    }, 0) / cardProgress.length || 0;

  return (
    <div className="w-100">
      {!authenticated && <LoginPrompt />}
      {!isCompleted ? (
        <h3 className="text-center">
          Nice work!{" "}
          <span role="img" aria-label="Tada!">
            🎉
          </span>
        </h3>
      ) : (
        [
          <h3 className="text-center mb-0" key="1">
            You're finished for now!
          </h3>,
          <div className="text-center w-100" key="2">
            Come back in{" "}
            <span className="text-secondary">{Math.ceil(daysUntilDeckProgressIsExpired)} days</span>{" "}
            to strengthen your progress.
          </div>,
        ]
      )}
      <div className="row d-flex mb-2 mt-5">
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
            style={{ right: 0, left: 0, top: "135px", zIndex: -1 }}
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
      {!isCompleted ? (
        <div className="d-flex flex-wrap justify-content-center">
          <button className="btn btn-outline-dark mr-2 mb-2" onClick={onGoBack}>
            Go back
          </button>
          <button className="btn btn-dark mb-2" onClick={onKeepGoing}>
            Press space to continue
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Link to="/" className="btn btn-dark">
            Go back home
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewResults;
