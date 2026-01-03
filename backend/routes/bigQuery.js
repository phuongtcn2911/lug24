import express from "express";
import * as bigQueryController from "../controllers/bigQueryController.js";

const router=express.Router();

router.post("/insertOrder",bigQueryController.insertOrder);
router.post("/checkExistCustomer",bigQueryController.checkExistCustomer);
router.post("/insertCustomer",bigQueryController.insertCustomer);
router.get("/getInitialData",bigQueryController.getInitialData);
router.get("/getAvailableLockerAmount",bigQueryController.getAvailableLockerAmount);
router.get("/getPrivateVoucher",bigQueryController.getPrivateVoucher);
router.get("/getAvailableLocker",bigQueryController.getAvailableLocker);
router.post("/createTransactLog",bigQueryController.createTransactLog);
router.post("/updateOrderStatus",bigQueryController.updateOrderStatus);


export default router;