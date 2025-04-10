import { startSearchCrypto } from "../utils/algo/algoRand.js";

async function searchHandler(req, res) {
  const algo = req.query.algo || "math";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const result = await startSearchCrypto((status) => {
      res.write(`data: ${JSON.stringify(status)}\n\n`);
      console.log(
        `[Random attempts: ${status.attempts}, Last privKey: ${status.privKey}]`
      );
    }, algo);
    res.write(`data: ${JSON.stringify({ found: true, ...result })}`);
    res.end();
  } catch (err) {
    console.error("Error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.status(500).json({ message: "Error search", error: err.message });
    res.end();
  }
}

export default searchHandler;
