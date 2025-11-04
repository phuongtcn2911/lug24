import express from "express";
import * as lockerController from "../controllers/lockerController.js";


    const router = express.Router();
    router.post('/getAvailableBox',lockerController.getAvailableBox);
    router.post('/countAvailableBox', lockerController.countAvailableBox);
    router.post('/openBox',lockerController.openBox);

export default router;
