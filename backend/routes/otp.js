const express= require("express");
const otpController=require("../controllers/otpController");
const router = express.Router();

router.post("/sendOTP",otpController.sendOTP);
router.post("/requestOTP",otpController.requestOTP);
router.post("/verifyOTP",otpController.verifyOTP);

module.exports=router;