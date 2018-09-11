import moment from "moment";

const SESSIONS_KEY = "sessions";
const SAVED_DECKS_KEY = "savedDecks";
// const STUDY_PROGRESS_KEY = "studyProgress";

/* Study sessions localStorage helpers */
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

/* Saved decks localStorage helpers */
export const setSavedDecks = decks => {
  localStorage.setItem(SAVED_DECKS_KEY, JSON.stringify(decks));
};

export const getSavedDecks = () => {
  return JSON.parse(localStorage.getItem(SAVED_DECKS_KEY)) || [];
};

export const toggleSavedDeck = (deckId, isSaved) => {
  const decks = getSavedDecks();

  const newDecks = isSaved ? decks.filter(el => el !== deckId) : [...decks, deckId];

  setSavedDecks(newDecks);

  return getSavedDecks();
};

/**
 * Study progress localStorage helpers:
 * User study progress data structure for each deck:
 *
 * <DECK_ID> : {
 *    cards: {
 *     <CARD_ID>: {
 *        reviewedAt: <LAST_REVIEWED_DATE>,
 *        leitnerBox: <CURRENT_LEITNER_BOX>
 *      },
 *   }
 * }
 */
export const getStudyProgress = () => {
  // TODO
};

export const getDeckProgressObject = deckId => {
  return JSON.parse(localStorage.getItem(deckId)) || {};
};

export const setDeckProgressObject = (deckId, value) => {
  localStorage.setItem(deckId, JSON.stringify(value));
};

export const addStudyProgress = (cardId, deckId, leitnerBox, reviewedAt) => {
  const deckProgressObj = getDeckProgressObject(deckId);
  const newCards = ((deckProgressObj || {}).cards || []).filter(el => el.card !== cardId);
  const newDeck = {
    ...deckProgressObj,
    cards: [...newCards, { card: cardId, leitnerBox, reviewedAt }],
  };
  setDeckProgressObject(deckId, newDeck);

  return getDeckProgressObject(deckId);
};
