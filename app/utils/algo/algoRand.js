const { ec: EC, rand } = require("elliptic");
const crypto = require("crypto");
const RIPEMD160 = require("ripemd160");
const ec = new EC("secp256k1");
const { getRandomBigIntCrypto } = require("./cryptoRandom");
const { getRandomBigIntMath } = require("./mathRand");
const { getRandomPseudo } = require("./pseudoRand");
const { getRandomSeq } = require("./randSeq");

function startSearchCrypto(onProgress, algo = "math") {
  const MIN = BigInt("555861086725107089408");
  const MAX = BigInt("556861086725107089408");
  const TARGET_HASH160 = "61eb8a50c86b0584bb727dd65bed8d2400d6d5aa";
  const PREFIX = "61eb";

  function getCompressedPublicKey(privateKeyBigInt) {
    const privateKeyHex = privateKeyBigInt.toString(16).padStart(64, "0");
    const key = ec.keyFromPrivate(privateKeyHex, "hex");
    return Buffer.from(key.getPublic().encodeCompressed());
  }

  function getHash160(pubKeyBuffer) {
    const sha256 = crypto.createHash("sha256").update(pubKeyBuffer).digest();
    return new RIPEMD160().update(sha256).digest().toString("hex");
  }
  const randomFn =
    algo === "crypto"
      ? getRandomBigIntCrypto
      : algo === "pseudo"
      ? getRandomPseudo
      : algo === "randseq"
      ? getRandomSeq
      : getRandomBigIntMath;

  return new Promise((resolve, reject) => {
    let attempts = 0;
    function loop() {
      attempts++;
      const privKey = randomFn(MIN, MAX);
      const pubKeyCompressed = getCompressedPublicKey(privKey);
      const hash160 = getHash160(pubKeyCompressed);

      if (hash160.startsWith(PREFIX)) {
        resolve({
          found: true,
          attempts,
          privKey: privKey.toString(),
          pubKey: pubKeyCompressed.toString("hex"),
          hash160,
        });
        return;
      }

      if (attempts % 10000 === 0 && onProgress) {
        onProgress({
          attempts,
          privKey: privKey.toString(),
        });
      }
      setImmediate(loop);
    }
    loop();
  });
}

module.exports = { startSearchCrypto };
