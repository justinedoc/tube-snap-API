import express from "express";
const router = express.Router();
import videoController from "../controllers/videoController.js";

router.get("/download", videoController);

export default router;
