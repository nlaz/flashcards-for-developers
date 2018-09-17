import React from "react";
import pluralize from "pluralize";
import { Cell, PieChart, Pie, Label } from "recharts";

import * as utils from "../utils/studyProgress";

const SkillProgress = ({ decks, studyProgress }) => {
  const avgProgress = Math.round(
    decks.reduce((avg, deck) => {
      const deckObj = studyProgress.find(el => el.deck === deck.id);
      const progress = utils.calcStudyProgress(deck, deckObj);
      return avg + progress * 100;
    }, 0) / decks.length,
  );

  const numPractices = decks.filter(deck => {
    const deckObj = studyProgress.find(el => el.deck === deck.id);
    const progress = utils.calcStudyProgress(deck, deckObj);
    return progress > 0;
  }).length;

  const avgProficiency =
    decks.reduce((avg, deck) => {
      const deckObj = studyProgress.find(el => el.deck === deck.id);
      const progress = utils.calcStudyProgress(deck, deckObj);
      const proficiency = utils.calcStudyProficiency(deckObj);
      return progress > 0 ? avg + proficiency : avg;
    }, 0.0) / numPractices;

  const subProgress = avgProgress * avgProficiency || 0;

  const progressData = [
    { name: "Offset", value: 100 - avgProgress || 0.01 },
    { name: "Progress", value: avgProgress - subProgress },
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
