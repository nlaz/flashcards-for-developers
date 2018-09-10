import moment from "moment";

const SESSIONS_KEY = "sessions";

export const getStudySessions = () => {
  return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
};

export const addStudySession = date => {
  const sessionsObj = getStudySessions();

  const sessions = [...sessionsObj, moment(date).format()].filter(
    (elem, pos, arr) => arr.indexOf(elem) === pos,
  );

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
