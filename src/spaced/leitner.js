import moment from "moment";

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
  console.log("checking is expired");
  return false;
}
