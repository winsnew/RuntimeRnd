const { startSearchCrypto } = require("../utils/algo/mathRandom");

function searchHandler(req, res) {
  const algo = req.query.algo || "math";
  let latestStatus = {};

  try {
    const result = startSearchCrypto((status) => {
      latestStatus = status;
      console.log(
        `[Random attempts: ${status.attempts}, Last privKey: ${status.privKey}]`
      );
    }, algo);

    res.json({ message: "Key Found!", algorithm: algo, ...result });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error search", error: err.message });
  }
}

module.exports = { searchHandler };
