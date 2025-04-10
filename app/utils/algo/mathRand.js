function getRandomBigIntMath(min, max) {
  const range = max - min;
  const randFloat = Math.random();
  const rand = BigInt(Math.floor(Number(range) * randFloat));
  return min + rand;
}

export { getRandomBigIntMath };
