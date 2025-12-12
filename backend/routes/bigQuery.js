import express from "express";
import * as bigQueryController from "../controllers/bigQueryController.js";

const router=express.Router();

router.post("/insertOrder",bigQueryController.insertOrder);
router.post("/checkExistCustomer",bigQueryController.checkExistCustomer);
router.post("/insertCustomer",bigQueryController.insertCustomer);
router.get("/getInitialData",bigQueryController.getInitialData);


export default router;