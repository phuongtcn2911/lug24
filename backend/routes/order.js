const express=require('express');
const router=express.Router();
const orderController=require("../controllers/orderController");


router.get('/generate-order-code',orderController.generateOrderCode);
router.post("/bookABox",orderController.bookABox);
router.post('/cancelABox',orderController.cancelABox);
router.post('/savePayment',orderController.savePayment);
router.post('/confirmPayment',orderController.confirmPayment);


module.exports=router;
