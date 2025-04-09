const { ec: EC } = require("elliptic");
const crypto = require("crypto");
const RIPEMD160 = require("ripemd160");

const ec = new EC("secp256k1");

const MIN = BigInt("430161086725107089408");
const MAX = BigInt("430861086725107089408");

const TARGET_HASH160 = "61eb8a50c86b0584bb727dd65bed8d2400d6d5aa";
const TARGET_PREFIX = "61eb8a5";

function getRandomBigIntWithMath(min, max) {
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
  const pubPoint = key.getPublic();
  return Buffer.from(pubPoint.encodeCompressed());
}

function getHash160(pubKeyBuffer) {
  const sha256 = crypto.createHash("sha256").update(pubKeyBuffer).digest();
  const ripemd160 = new RIPEMD160().update(sha256).digest();
  return ripemd160.toString("hex");
}

function startSearch() {
  let attempts = 0;
  while (true) {
    attempts++;
    const privKey = getRandomBigIntWithMath(MIN, MAX);
    const pubkeyCompress = getCompressedPublicKey(privKey);
    const hash160 = getHash160(pubkeyCompress);
    if (hash160 === TARGET_HASH160) {
      console.log(`found at attempt ${attempts}`);
      console.log(`private key      : ${privKey.toString()}`);
      console.log(`compressed pubkey: ${pubkeyCompress.toString("hex")}`);
      console.log(`hash160          : ${hash160}`);
      break;
    }
    if (attempts % 10000 === 0) {
      console.log(
        `trying... [${attempts}, last privkey: ${privKey.toString()}]`
      );
    }
  }
}

module.exports = { startSearch };
