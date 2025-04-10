const express = require("express");
const app = express();
const randomRoutes = require("./app/routes/searchRoutes");

app.use(express.json());
app.use("/btc/random", randomRoutes);
app.get("/", (req, res) => {
  res.send("Random search api is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
