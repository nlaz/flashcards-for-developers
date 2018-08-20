export const setSavedDecks = decks => {
  localStorage.setItem("savedDecks", JSON.stringify(decks));
};

export const getSavedDecks = () => {
  return JSON.parse(localStorage.getItem("savedDecks")) || [];
};
