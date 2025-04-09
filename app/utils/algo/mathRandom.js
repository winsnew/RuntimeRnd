function startSearchCrypto(onProgress, algo = "math") {
  const { ec: EC, rand } = require("elliptic");
  const crypto = require("crypto");
  const RIPEMD160 = require("ripemd160");
  const ec = new EC("secp256k1");

  const MIN = BigInt("555861086725107089408");
  const MAX = BigInt("556861086725107089408");
  const TARGET_HASH160 = "61eb8a50c86b0584bb727dd65bed8d2400d6d5aa";

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

  function getRandomBigIntMath(min, max) {
    const range = max - min;
    const randFloat = Math.random();
    const rand = BigInt(Math.floor(Number(range) * randFloat));
    return min + rand;
  }

  function getRandomPseudo(min, max) {
    const range = max - min;

    let rand = BigInt(0);
    for (let i = 0; i < 6; i++) {
      const part = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
      rand = (rand << BigInt(53)) + part;
    }

    return min + (rand % range);
  }

  function getCompressedPublicKey(privateKeyBigInt) {
    const privateKeyHex = privateKeyBigInt.toString(16).padStart(64, "0");
    const key = ec.keyFromPrivate(privateKeyHex, "hex");
    return Buffer.from(key.getPublic().encodeCompressed());
  }

  function getHash160(pubKeyBuffer) {
    const sha256 = crypto.createHash("sha256").update(pubKeyBuffer).digest();
    return new RIPEMD160().update(sha256).digest().toString("hex");
  }
  let randomFn;
  if (algo === "crypto") randomFn = getRandomBigIntCrypto;
  else if (algo === "pseudo") randomFn = getRandomPseudo;
  else randomFn = getRandomBigIntMath;

  let attempts = 0;
  while (true) {
    attempts++;
    const privKey = randomFn(MIN, MAX);
    const pubKeyCompressed = getCompressedPublicKey(privKey);
    const hash160 = getHash160(pubKeyCompressed);

    if (hash160 === TARGET_HASH160) {
      return {
        found: true,
        attempts,
        privKey: privKey.toString(),
        pubKey: pubKeyCompressed.toString("hex"),
        hash160,
      };
    }

    if (attempts % 10000 === 0 && onProgress) {
      onProgress({ attempts, privKey: privKey.toString(), hash160 });
    }
  }
}

module.exports = { startSearchCrypto };
