const { startSearch } = require("../utils/cryptoRandom");

function searchHandler(req, res) {
  const algo = req.query.algo || "crypto";
  const useCrypto = algo === "crypto";
  let latestStatus = {};

  try {
    const result = startSearch((status) => {
      latestStatus = status;
      console.log(
        `[Random attempts: ${status.attempts}, Last privKey: ${status.privKey}]`
      );
    }, useCrypto);

    res.json({ message: "Key Found!", algorithm: algo, ...result });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error search", error: err.message });
  }
}

module.exports = { searchHandler };
