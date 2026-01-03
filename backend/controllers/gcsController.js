import express from "express";
import { uploadFaceImg } from "../services/googleCloudStore.js";

const router = express.Router();


export async function uploadImage(req, res) {
    try {
        const { orderID, customerID, type } = req.body;
        const file = req.file;

        // console.log("req.file:", req.file);
        // console.log("req.body:", req.body);

        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const imgUrl = await uploadFaceImg({
            orderID,
            customerID,
            type,
            buffer: file.buffer
        });

        res.json({
            success: true,
            imgURL: imgUrl
        });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload image failed" });
    }
}

