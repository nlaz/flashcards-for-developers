import moment from "moment";
import * as leitner from "../../spaced/leitner";

export const getUpdatedCard = (card, isCorrect) => {
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

export const calcStudyProgress = (deck = {}, deckProgressObj = {}) => {
  const numStudiedCards = (deckProgressObj.cards || []).length;
  const numTotalCards = (deck.cards || []).length;
  return numStudiedCards / numTotalCards || 0;
};

export const calcStudyProficiency = (deck = {}, deckProgressObj = {}) => {
  const cardsObj = deckProgressObj.cards || {};
  const numStudiedCards = Object.keys(cardsObj).length;

  return numStudiedCards > 0
    ? Object.keys(cardsObj).reduce((avg, el) => {
        const { leitnerBox, reviewedAt } = cardsObj[el];
        return avg + leitner.getProficiency(leitnerBox, reviewedAt);
      }, 0.0) / numStudiedCards
    : 0.0;
};
