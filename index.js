import express from "express";
const app = express();
import { router } from "./app/routes/searchRoutes.js";

app.use(express.json());
app.use("/btc/random", router);
app.get("/", (req, res) => {
  res.send("Random search api is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
