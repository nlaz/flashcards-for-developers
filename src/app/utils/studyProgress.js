import moment from "moment";
import * as leitner from "../../spaced/leitner";

export const calcUpdatedLevel = (cardObj, isCorrect) => {
  const { leitnerBox, reviewedAt } = cardObj;
  const newReviewTimestamp = moment();
  const diffReviewDays = moment(newReviewTimestamp).diff(moment(reviewedAt), "days");

  if (!leitnerBox || !reviewedAt) {
    return {
      reviewedAt: newReviewTimestamp.format(),
      leitnerBox: isCorrect ? 1 : 0,
    };
  }

  // Don't update card progress if not right number of days passed
  if (diffReviewDays < leitnerBox) {
    return { leitnerBox, reviewedAt };
  }

  const newLeitnerBox = isCorrect ? leitnerBox + 1 : Math.max(1, leitnerBox - 1);
  return { reviewedAt: newReviewTimestamp.format(), leitnerBox: newLeitnerBox };
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
