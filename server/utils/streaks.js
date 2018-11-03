const moment = require("moment");

module.exports.getCurrentStreak = dates => {
  let count = 0;
  const sortedDates = [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  for (let [index, date] of sortedDates.entries()) {
    const today = moment();
    const prevDate = index > 0 ? sortedDates[index - 1] : today.format();
    const hoursBetween = moment(prevDate).diff(moment(date), "hours");

    if (hoursBetween < 0 || hoursBetween > 24) break;
    count = count + 1;
  }
  return count;
};

module.exports.getLongestStreak = dates => {
  let count = 0;
  const sortedDates = [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  for (let [index, date] of sortedDates.entries()) {
    const today = moment();
    const prevDate = index > 0 ? sortedDates[index - 1] : today.format();
    const hoursBetween = moment(prevDate).diff(moment(date), "hours");

    if (hoursBetween < 0 || hoursBetween > 24) break;
    count = count + 1;
  }
  return count;
};
