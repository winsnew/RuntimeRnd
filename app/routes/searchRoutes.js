const express = require("express");
const { searchHandler } = require("../controller/rndController");

const router = express.Router();

router.get("/", searchHandler);

module.exports = router;
