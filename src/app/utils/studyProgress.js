import moment from "moment";
import * as leitner from "../../spaced/leitner";

const SESSIONS_KEY = "sessions";

export const getStudyProgress = deckId => {
  let studyObj = JSON.parse(localStorage.getItem(deckId)) || {};

  return studyObj.progress || 0;
};

export const getStudyProficiency = deckId => {
  let studyObj = JSON.parse(localStorage.getItem(deckId)) || {};

  const { reviewedAt, leitnerBox } = studyObj;

  return leitner.getProficiency(leitnerBox, reviewedAt) || 0;
};

export const setStudyProgress = (progress, deckId) => {
  const progressObj = {
    progress,
    reviewedAt: moment(),
    leitnerBox: 1, //TODO increment/decrement leitner box
  };
  localStorage.setItem(deckId, JSON.stringify(progressObj));
};

export const addStudyHistory = () => {
  const sessionsObj = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];

  const currentDate = moment().startOf("day");

  const sessions = [...sessionsObj, currentDate.format()].filter(
    (elem, pos, arr) => arr.indexOf(elem) === pos,
  );

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
