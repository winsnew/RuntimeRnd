function getRandomPseudo(min, max) {
  const range = max - min;

  let rand = BigInt(0);
  for (let i = 0; i < 6; i++) {
    const part = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    rand = (rand << BigInt(53)) + part;
  }

  return min + (rand % range);
}

module.exports = { getRandomPseudo };
