import express from "express"
import * as zaloController from "../controllers/zaloController.js" 

const router=express.Router();

router.post("/sendOTPZalo",zaloController.sendOTPZalo);


export default router;