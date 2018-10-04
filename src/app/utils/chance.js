export const bool = () => Math.random() >= 0.5;

export const integer = ({ min, max }) => Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = array => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
