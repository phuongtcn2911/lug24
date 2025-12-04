import express from "express";
import * as orderController from "../controllers/orderController.js";


const router=express.Router();



// router.get('/generate-order-code',orderController.generateOrderCode);
router.post("/bookABox",orderController.bookABox);
router.post('/cancelABox',orderController.cancelABox);
router.post('/savePayment',orderController.savePayment);
router.post('/confirmPayment',orderController.confirmPayment);
router.post('/sendReceipt',orderController.sendReceipt);
router.post('/readQRCode',orderController.readQRCode);



export default router;
