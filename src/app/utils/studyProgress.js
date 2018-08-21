import moment from "moment";
import * as leitner from "../../spaced/leitner";

const SESSIONS_KEY = "sessions";

/**
 * Study progress data structure for each deck:
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

export const getDeckStudyObject = deckId => {
  return JSON.parse(localStorage.getItem(deckId)) || {};
};

export const setDeckStudyObject = (deckId, value) => {
  localStorage.setItem(deckId, JSON.stringify(value));
};

export const getStudyProgress = deck => {
  const studyObj = getDeckStudyObject(deck.id);

  const numStudiedCards = Object.keys(studyObj.cards || {}).length;
  const numTotalCards = (deck.cards || []).length;
  const progress = numStudiedCards / numTotalCards;
  return progress || 0;
};

export const getStudyProficiency = deck => {
  const studyObj = getDeckStudyObject(deck.id);

  const cardsObj = studyObj.cards || {};
  const numStudiedCards = Object.keys(cardsObj).length;

  return numStudiedCards > 0
    ? Object.keys(cardsObj).reduce((avg, el) => {
        const { leitnerBox, reviewedAt } = cardsObj[el];
        return avg + leitner.getProficiency(leitnerBox, reviewedAt);
      }, 0.0) / numStudiedCards
    : 0.0;
};

export const setDeckStudyProgress = (progress, deckId) => {
  const progressObj = {
    progress,
    reviewedAt: moment(),
    leitnerBox: 1, //TODO increment/decrement leitner box
  };

  setDeckStudyObject(deckId, progressObj);
};

const getUpdatedCard = (card, isCorrect) => {
  if (!card) {
    return {
      reviewedAt: moment(),
      leitnerBox: isCorrect ? 1 : 0,
    };
  }

  const { leitnerBox, reviewedAt } = card;
  const diff = moment(reviewedAt).diff(moment(), "days");
  // Update leitner levels level only if right number of days passed
  if (diff < leitnerBox) {
    return {
      leitnerBox,
      reviewedAt: moment(),
    };
  }
  return {
    reviewedAt: moment(),
    leitnerBox: isCorrect ? leitnerBox + 1 : Math.max(1, leitnerBox - 1),
  };
};

export const setCardStudyProgress = (cardId, deckId, isCorrect) => {
  const deck = getDeckStudyObject(deckId);
  const { cards = {} } = deck;
  const currentCard = getUpdatedCard(cards[cardId], isCorrect);
  const newDeck = { cards: { ...cards, [cardId]: currentCard } };
  setDeckStudyObject(deckId, newDeck);
};

export const getStudyHistory = () => {
  return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
};

export const addStudyHistory = () => {
  const sessionsObj = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];

  const currentDate = moment().startOf("day");

  const sessions = [...sessionsObj, currentDate.format()].filter(
    (elem, pos, arr) => arr.indexOf(elem) === pos,
  );

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
