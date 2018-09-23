import moment from "moment";

const SESSIONS_KEY = "sessions";
const PINNED_DECKS_KEY = "savedDecks";
const STUDY_PROGRESS_KEY = "studyProgress";
const PREFS_USE_SRS_KEY = "prefsUseSRS";
const DEFAULT_SRS_PREF = true;

/* Preferences localStorage helpers */
export const setSRSPref = value => {
  localStorage.setItem(PREFS_USE_SRS_KEY, JSON.stringify(value));
};

export const getSRSPref = () => {
  const pref = JSON.parse(localStorage.getItem(PREFS_USE_SRS_KEY));
  return pref !== null ? pref : DEFAULT_SRS_PREF;
};

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

/* Pinned decks localStorage helpers */
export const setPinnedDecks = decks => {
  localStorage.setItem(PINNED_DECKS_KEY, JSON.stringify(decks));
};

export const getPinnedDecks = () => {
  return JSON.parse(localStorage.getItem(PINNED_DECKS_KEY)) || [];
};

export const togglePinnedDeck = (deckId, isPinned) => {
  const decks = getPinnedDecks();

  const newDecks = isPinned ? decks.filter(el => el !== deckId) : [...decks, deckId];

  setPinnedDecks(newDecks);

  return getPinnedDecks();
};

/**
 * Study progress localStorage helpers:
 * User study progress data structure for each deck:
 *
 *  <STUDY_PROGRESS_KEY> : [
 *     {
 *        deck: <DECK_ID>
 *        cards: [
 *           card: <CARD_ID>
 *           reviewedAt: <LAST_REVIEWED_DATE>
 *           leitnerBox: <CURRENT_LEITNER_BOX>
 *        ]
 *     }
 *  ]
 */
export const getStudyProgress = () => {
  return JSON.parse(localStorage.getItem(STUDY_PROGRESS_KEY)) || [];
};

export const setStudyProgress = studyProgress => {
  localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(studyProgress));
};

export const getDeckProgressObject = deckId => {
  const studyObj = getStudyProgress();
  return studyObj.find(el => el.deck === deckId) || {};
};

export const setDeckProgressObject = (deckId, value) => {
  const studyObj = getStudyProgress();
  const filtered = studyObj.filter(el => el.deck !== deckId);

  setStudyProgress([...filtered, value]);
};

export const addCardProgress = (deckId, cardId, leitnerBox, reviewedAt) => {
  const deckProgressObj = getDeckProgressObject(deckId);
  const filtered = (deckProgressObj.cards || []).filter(el => el.card !== cardId);
  const newDeck = {
    deck: deckId,
    cards: [...filtered, { card: cardId, leitnerBox, reviewedAt }],
  };
  setDeckProgressObject(deckId, newDeck);

  return getDeckProgressObject(deckId);
};
