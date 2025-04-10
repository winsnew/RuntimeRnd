let sequence = 0n;

function getRandomSeq(min, max) {
  const minStr = min.toString();
  const prefix = minStr.slice(0, 3);
  const randomDigits = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  const maxSeq = 10n ** 7n;
  if (sequence >= maxSeq) sequence = 0n;

  const seqStr = sequence.toString().padStart(7, "0");
  sequence += 1n;

  const fullStr = prefix + randomDigits + seqStr;
  const fullBigInt = BigInt(fullStr);
  if (fullBigInt < min || fullBigInt > max) {
    return getRandomSeq(min, max);
  }

  return fullBigInt;
}

module.exports = { getRandomSeq };

if (require.main === module) {
  const min = BigInt("555861086725107089408");
  const max = BigInt("556861086725107089408");

  console.log("Contoh 10 randomSeq:");
  for (let i = 0; i < 10; i++) {
    const result = getRandomSeq(min, max);
    console.log(`${i + 1}. ${result}`);
  }
}
