const express = require("express");
const { searchHandler } = require("../controller/rndController");

const router = express.Router();

router.get("/random", searchHandler);

module.exports = router;
