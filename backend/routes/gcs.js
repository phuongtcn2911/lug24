import express from "express";
import * as gcsController from "../controllers/gcsController.js";
import multer from "multer";

const router = express.Router();
const upload=multer({
    storage:multer.memoryStorage()
});

router.post("/uploadImage",upload.single("image"), gcsController.uploadImage);

export default router;