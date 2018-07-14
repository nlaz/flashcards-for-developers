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
});
