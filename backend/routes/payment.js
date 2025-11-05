import express from "express";
import * as paymentController from"../controllers/paymentController.js";

const router =express.Router();

router.post("/createPayment",paymentController.createPayment);
router.post("/confirmPaymentSePay",paymentController.confirmPaymentSePay);

export default router;