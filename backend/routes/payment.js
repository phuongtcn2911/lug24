import express from "express";
import * as paymentController from"../controllers/paymentController.js";

const router =express.Router();

router.post("/createPaymentSePay",paymentController.createPaymentSePay);
router.post("/confirmPaymentSePay",paymentController.confirmPaymentSePay);

export default router;