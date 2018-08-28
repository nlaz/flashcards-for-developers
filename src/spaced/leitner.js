import moment from "moment";

const EXPIRED_LEVEL = 0.5;

export function getProficiency(box, reviewedAt) {
  const interval = getInterval(box);
  const daysSince = getDaysSince(reviewedAt);
  const delta = daysSince / (2 * interval);
  return Math.max(1.0 - delta, 0);
}

export function getInterval(box) {
  return 2 ** box;
}

export function getDaysSince(reviewedAt) {
  return moment().diff(moment(reviewedAt), "days");
}

export function isExpired(box, reviewedAt) {
  return getProficiency(box, reviewedAt) <= EXPIRED_LEVEL;
}

export function getDaysUntilExpired(box, reviewedAt) {
  return Math.max(getInterval(box) - getDaysSince(reviewedAt), 0);
}
