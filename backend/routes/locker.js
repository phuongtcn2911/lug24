import express from "express";
import * as lockerController from "../controllers/lockerController.js";

const router=express.Router();

router.get('/getAvailableBox',lockerController.getAvailableBox);
router.get('/countAvailableBox',lockerController.countAvailableBox);
router.post('/openBox',lockerController.openBox);

export default router;