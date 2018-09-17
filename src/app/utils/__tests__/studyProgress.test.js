import moment from "moment";
import * as leitner from "../../../spaced/leitner";

import { calcUpdatedLevel, calcStudyProgress, calcStudyProficiency } from "../studyProgress";

const today = moment();
const twoDaysAgo = moment().subtract("2", "days");
const threeDaysAgo = moment().subtract("3", "days");

describe("calcUpdatedLevel", () => {
  it("should increment card level if card is expired and answer is correct", () => {
    const expiredCard = { reviewedAt: threeDaysAgo, leitnerBox: 1 };
    expect(calcUpdatedLevel(expiredCard, true).leitnerBox).toBe(expiredCard.leitnerBox + 1);
  });

  it("should decrement card level if card answer is incorrect", () => {
    const expiredCard = { reviewedAt: threeDaysAgo, leitnerBox: 2 };
    expect(calcUpdatedLevel(expiredCard, false).leitnerBox).toBe(expiredCard.leitnerBox - 1);
  });

  it("should not change card level if card is not expired", () => {
    const expiredCard = { reviewedAt: today, leitnerBox: 2 };
    expect(calcUpdatedLevel(expiredCard, false).leitnerBox).toBe(expiredCard.leitnerBox);
  });

  it("should not update reviewed time to current date if not expired", () => {
    const expiredCard = { reviewedAt: threeDaysAgo, leitnerBox: 100 };
    expect(calcUpdatedLevel(expiredCard, false).reviewedAt).toBe(threeDaysAgo);
  });

  it("should update reviewed time to current date if expired", () => {
    const expiredCard = { reviewedAt: threeDaysAgo, leitnerBox: 1 };
    expect(calcUpdatedLevel(expiredCard, false).reviewedAt).toBe(today.format());
  });
});

describe("calcStudyProgress", () => {
  it("should return percentage of cards studied at least once", () => {
    const mockCards = ["123", "234", "456", "678"];
    const mockCardProgress = ["101", "010", "001"];

    const deck = { cards: mockCards };
    const deckProgressObj = { cards: mockCardProgress };

    expect(calcStudyProgress(deck, deckProgressObj)).toBe(3 / 4);
  });
  it("should return zero progress if no cards studied", () => {
    const mockCards = ["123", "234", "456", "678"];
    const mockCardProgress = [];

    const deck = { cards: mockCards };
    const deckProgressObj = { cards: mockCardProgress };

    expect(calcStudyProgress(deck, deckProgressObj)).toBe(0 / 4);
  });
  it("should return maximum of 100% progress", () => {
    const mockCards = ["123", "234", "456", "678"];
    const mockCardProgress = ["101", "010", "001", "100", "110"];

    const deck = { cards: mockCards };
    const deckProgressObj = { cards: mockCardProgress };

    expect(calcStudyProgress(deck, deckProgressObj)).toBe(1);
  });
});

describe("calcStudyProficiency", () => {
  it("should return the average study proficiency of deck", () => {
    const card1 = { reviewedAt: today, leitnerBox: 2 };
    const card2 = { reviewedAt: twoDaysAgo, leitnerBox: 1 };
    const mockCardProgress = [card1, card2];

    const deckProgressObj = { cards: mockCardProgress };

    expect(leitner.getProficiency(card1.leitnerBox, card1.reviewedAt)).toBe(1);
    expect(leitner.getProficiency(card2.leitnerBox, card2.reviewedAt)).toBe(0.5);
    expect(calcStudyProficiency(deckProgressObj)).toBe((1 + 0.5) / 2);
  });

  it("should return zero percentage if no cards have been studied", () => {
    const deckProgressObj = { cards: [] };

    expect(calcStudyProficiency(deckProgressObj)).toBe(0);
  });
});
