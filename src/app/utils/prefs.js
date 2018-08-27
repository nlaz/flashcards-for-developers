const PREFS_USE_SRS_KEY = "prefsUseSRS";
const DEFAULT_SRS_PREF = true;

export const setSRSPref = value => {
  console.log("val", value);
  localStorage.setItem(PREFS_USE_SRS_KEY, JSON.stringify(value));
};

export const getSRSPref = () => {
  const pref = JSON.parse(localStorage.getItem(PREFS_USE_SRS_KEY));
  return pref !== null ? pref : DEFAULT_SRS_PREF;
};
