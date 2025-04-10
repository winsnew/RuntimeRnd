import express from "express";
import searchHandler from "../controller/rndController.js";

const router = express.Router();

router.get("/", searchHandler);

export { router };
