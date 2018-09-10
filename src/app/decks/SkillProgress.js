import React from "react";
import pluralize from "pluralize";
import { Cell, PieChart, Pie, Label } from "recharts";

import { getStudyProgress, getStudyProficiency } from "../utils/localStorage/userStudyProgress";

const SkillProgress = ({ decks }) => {
  const progress = Math.round(
    decks.reduce((avg, el) => avg + getStudyProgress(el) * 100, 0) / decks.length,
  );
  const numPractices = decks.filter(el => getStudyProgress(el) > 0).length;

  const proficiency =
    decks.reduce((avg, el) => {
      return getStudyProgress(el) > 0 ? avg + getStudyProficiency(el) : avg;
    }, 0.0) / numPractices;

  const subProgress = progress * proficiency || 0;

  const progressData = [
    { name: "Offset", value: 100 - progress || 1 },
    { name: "Progress", value: progress - subProgress },
    { name: "Proficiency", value: subProgress },
  ];

  return (
    <div className="d-flex flex-row-reverse flex-lg-row justify-content-end justify-content-lg-center align-items-center w-100">
      <div className="mx-2">
        <p
          className="m-0 text-uppercase font-weight-medium"
          style={{ fontSize: "14px", lineHeight: "12px" }}
        >
          Skill Progress
        </p>
        <p className="text-secondary m-0" style={{ fontSize: "14px" }}>
          You practiced {pluralize("skill", numPractices, true)}
        </p>
      </div>
      <PieChart height={70} width={70}>
        <Pie
          data={progressData}
          dataKey="value"
          innerRadius={24}
          outerRadius={35}
          startAngle={90}
          endAngle={360 + 90}
          isAnimationActive={false}
          stroke="none"
        >
          <Cell fill="#e1e1e2" />
          <Cell fill="#cfcfcf" />
          <Cell fill="#343a40" />
          <Label
            className="font-weight-bold"
            fill="#343a40"
            position="center"
            style={{ fontSize: "16px" }}
            value={`${subProgress.toFixed()}%`}
          />
        </Pie>
      </PieChart>
    </div>
  );
};

export default SkillProgress;
