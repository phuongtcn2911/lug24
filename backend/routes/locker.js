const express=require('express');
const lockerController=require("../controllers/lockerController");
const router=express.Router();

router.get('/getAvailableBox',lockerController.getAvailableBox);
router.get('/countAvailableBox',lockerController.countAvailableBox);
router.post('/openBox',lockerController.openBox);

module.exports=router;