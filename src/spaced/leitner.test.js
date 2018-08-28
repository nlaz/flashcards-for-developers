import * as leitner from "./leitner";
import moment from "moment";

describe("Leitner study technique", () => {
  describe("getInterval", () => {
    it("should return exponentially increasing study interval", () => {
      expect(leitner.getInterval(0)).toBe(1);
      expect(leitner.getInterval(1)).toBe(2);
      expect(leitner.getInterval(2)).toBe(4);
      expect(leitner.getInterval(3)).toBe(8);
      expect(leitner.getInterval(4)).toBe(16);
      expect(leitner.getInterval(5)).toBe(32);
    });
  });

  describe("getDaysSince", () => {
    it("should return number of days since studying", () => {
      expect(leitner.getDaysSince(moment().subtract(1, "days"))).toBe(1);
      expect(leitner.getDaysSince(moment().subtract(2, "days"))).toBe(2);
      expect(leitner.getDaysSince(moment().subtract(3, "days"))).toBe(3);
      expect(leitner.getDaysSince(moment().subtract(4, "days"))).toBe(4);
      expect(leitner.getDaysSince(moment().subtract(5, "days"))).toBe(5);
    });
  });

  describe("getProficiency", () => {
    it("should return proficiency for leitner level 0", () => {
      expect(leitner.getProficiency(0, moment().subtract(0, "days"))).toBe(1);
      expect(leitner.getProficiency(0, moment().subtract(1, "days"))).toBeCloseTo(0.5);
      expect(leitner.getProficiency(0, moment().subtract(2, "days"))).toBe(0);
      expect(leitner.getProficiency(0, moment().subtract(3, "days"))).toBe(0);
    });
    it("should return proficiency for leitner level 1", () => {
      expect(leitner.getProficiency(1, moment().subtract(0, "days"))).toBe(1);
      expect(leitner.getProficiency(1, moment().subtract(1, "days"))).toBe(0.75);
      expect(leitner.getProficiency(1, moment().subtract(2, "days"))).toBe(0.5);
      expect(leitner.getProficiency(1, moment().subtract(3, "days"))).toBe(0.25);
      expect(leitner.getProficiency(1, moment().subtract(4, "days"))).toBe(0);
    });
    it("should return proficiency for leitner level 2", () => {
      expect(leitner.getProficiency(2, moment().subtract(0, "days"))).toBe(1);
      expect(leitner.getProficiency(2, moment().subtract(1, "days"))).toBe(0.875);
      expect(leitner.getProficiency(2, moment().subtract(2, "days"))).toBe(0.75);
      expect(leitner.getProficiency(2, moment().subtract(3, "days"))).toBe(0.625);
      expect(leitner.getProficiency(2, moment().subtract(4, "days"))).toBe(0.5);
    });
    it("should return proficiency for leitner level 3", () => {
      expect(leitner.getProficiency(3, moment().subtract(0, "days"))).toBe(1);
      expect(leitner.getProficiency(3, moment().subtract(1, "days"))).toBeCloseTo(0.94);
      expect(leitner.getProficiency(3, moment().subtract(2, "days"))).toBeCloseTo(0.875);
      expect(leitner.getProficiency(3, moment().subtract(3, "days"))).toBeCloseTo(0.815);
      expect(leitner.getProficiency(3, moment().subtract(8, "days"))).toBe(0.5);
      expect(leitner.getProficiency(3, moment().subtract(16, "days"))).toBe(0);
    });
    it("should return proficiency for level 4", () => {
      expect(leitner.getProficiency(4, moment().subtract(0, "days"))).toBe(1);
      expect(leitner.getProficiency(4, moment().subtract(1, "days"))).toBeCloseTo(0.97);
      expect(leitner.getProficiency(4, moment().subtract(2, "days"))).toBeCloseTo(0.94);
      expect(leitner.getProficiency(4, moment().subtract(3, "days"))).toBeCloseTo(0.91);
      expect(leitner.getProficiency(4, moment().subtract(4, "days"))).toBeCloseTo(0.875);
      expect(leitner.getProficiency(4, moment().subtract(16, "days"))).toBeCloseTo(0.5);
      expect(leitner.getProficiency(4, moment().subtract(32, "days"))).toBeCloseTo(0);
    });
  });

  describe("isExpired", () => {
    const card1 = { box: 1, reviewedAt: moment().subtract(3, "days") };
    const card2 = { box: 4, reviewedAt: moment().subtract(3, "days") };
    it("should return expired if proficiency level under 50%", () => {
      expect(leitner.getProficiency(card1.box, card1.reviewedAt)).toBe(0.25);
      expect(leitner.isExpired(card1.box, card1.reviewedAt)).toBe(true);
    });
    it("should return not expired if proficiency level above 50%", () => {
      expect(leitner.getProficiency(card2.box, card2.reviewedAt)).toBeCloseTo(0.91);
      expect(leitner.isExpired(card2.box, card2.reviewedAt)).toBe(false);
    });
  });

  describe("getDaysUntilExpired", () => {
    const threeDaysAgo = moment().subtract(3, "days");
    const eightDaysAgo = moment().subtract(8, "days");
    const fiftyDaysAgo = moment().subtract(50, "days");
    const card1 = { box: 3, reviewedAt: threeDaysAgo };
    const card2 = { box: 3, reviewedAt: eightDaysAgo };
    const card3 = { box: 4, reviewedAt: fiftyDaysAgo };
    const card4 = { box: 5, reviewedAt: moment().add(1, "days") };

    it("should return number of days until card reaches the expiration level", () => {
      expect(leitner.getInterval(card1.box)).toBe(8);
      expect(leitner.getDaysSince(card1.reviewedAt)).toBe(3);
      expect(leitner.getProficiency(card1.box, card1.reviewedAt)).toBeCloseTo(0.81);
      expect(leitner.getDaysUntilExpired(card1.box, card1.reviewedAt)).toBe(5);
    });
    it("should return 0 days if card is expired", () => {
      expect(leitner.getInterval(card2.box)).toBe(8);
      expect(leitner.getDaysSince(card2.reviewedAt)).toBe(8);
      expect(leitner.getProficiency(card2.box, card2.reviewedAt)).toBeCloseTo(0.5);
      expect(leitner.getDaysUntilExpired(card2.box, card2.reviewedAt)).toBe(0);
    });
    it("should return 0 days if card is really expired", () => {
      expect(leitner.getInterval(card3.box)).toBe(16);
      expect(leitner.getDaysSince(card3.reviewedAt)).toBe(50);
      expect(leitner.getProficiency(card3.box, card3.reviewedAt)).toBeCloseTo(0);
      expect(leitner.getDaysUntilExpired(card3.box, card3.reviewedAt)).toBe(0);
    });
    it("should return study interval if card has just been reviewed", () => {
      expect(leitner.getInterval(card4.box)).toBe(32);
      expect(leitner.getDaysSince(card4.reviewedAt)).toBe(0);
      expect(leitner.getProficiency(card4.box, card4.reviewedAt)).toBe(1);
      expect(leitner.getDaysUntilExpired(card4.box, card4.reviewedAt)).toBe(32);
    });
  });
});
