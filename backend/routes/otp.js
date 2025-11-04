import express from "express";
import * as otpController from "../controllers/otpController.js";

const router = express.Router();

router.post("/sendOTP", otpController.sendOTP);
router.post("/requestOTP", otpController.requestOTP);
router.post("/verifyOTP", otpController.verifyOTP);

export default router;