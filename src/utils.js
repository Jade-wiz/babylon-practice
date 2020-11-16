const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomBetween = randomBetween;
