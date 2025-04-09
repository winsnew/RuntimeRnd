const bitcoin = require("bitcoinjs-lib");
const ECPairFactory = require("ecpair").ECPairFactory;
const tinysecp = require("tiny-secp256k1");

const ECPair = ECPairFactory(tinysecp);

const part1 = "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3q";

const base58chars =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const fullLength = 19;
const knownPrefix = "e";
const suffixLength = fullLength - knownPrefix.length;

function getRandomBase58String(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * base58chars.length);
    result += base58chars[index];
  }
  return result;
}

(async () => {
  console.log(`Random search start...`);
  console.log(
    `Prefix part2: "${knownPrefix}" | Panjang total part2: ${fullLength}\n`
  );

  let count = 0;

  while (true) {
    count++;
    const randomSuffix = getRandomBase58String(suffixLength);
    const part2 = knownPrefix + randomSuffix;
    const wifKey = part1 + part2;

    if (count % 10000 === 0) {
      console.log(`[${count}] Testing WIF: ${wifKey}`);
    }

    try {
      const keyPair = ECPair.fromWIF(wifKey);
      const { address } = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
      });

      if (address.startsWith("1MVD")) {
        console.log("\n Found!");
        console.log("WIF:", wifKey);
        console.log("Address:", address);
        break;
      }
    } catch (err) {
      // WIF invalid, continue
    }
  }
})();
