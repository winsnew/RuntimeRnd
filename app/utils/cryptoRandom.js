const { ec: EC } = require("elliptic");
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

function getCompressedPublicKey(privateKeyBigInt) {
  const privateKeyHex = privateKeyBigInt.toString(16).padStart(64, "0");
  const key = ec.keyFromPrivate(privateKeyHex, "hex");
  return Buffer.from(key.getPublic().encodeCompressed());
}

function getHash160(pubKeyBuffer) {
  const sha256 = crypto.createHash("sha256").update(pubKeyBuffer).digest();
  return new RIPEMD160().update(sha256).digest().toString("hex");
}

function startSearchCrypto() {
  let attempts = 0;
  console.log("🔐 Searching with crypto.randomBytes...");
  while (true) {
    attempts++;
    const privKey = getRandomBigIntCrypto(MIN, MAX);
    const pubKeyCompressed = getCompressedPublicKey(privKey);
    const hash160 = getHash160(pubKeyCompressed);

    if (hash160 === TARGET_HASH160) {
      console.log(`✅ FOUND after ${attempts} attempts!`);
      console.log(`Private Key       : ${privKey.toString()}`);
      console.log(`Compressed PubKey : ${pubKeyCompressed.toString("hex")}`);
      console.log(`HASH160           : ${hash160}`);
      break;
    }

    if (attempts % 10000 === 0) {
      console.log(`[Crypto] Still searching... attempts: ${attempts}`);
    }
  }
}

startSearchCrypto();
