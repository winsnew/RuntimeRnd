import crypto from "crypto";

function getRandomBigIntCrypto(min, max) {
  const range = max - min;
  const byteLength = Math.ceil(range.toString(2).length / 8);
  let rand;
  do {
    const buf = crypto.randomBytes(byteLength);
    rand = BigInt("0x" + buf.toString("hex"));
  } while (rand > range);
  return min + rand;
}

export { getRandomBigIntCrypto };
