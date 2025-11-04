import axios from "axios";
import { getSmartLockerConfig } from "../config.js";


// const apiURL = process.env.SMARTLOCKER_API;
// const apiKey = process.env.SMARTLOCKER_TOKEN;
// const deviceNo = process.env.DEVICE_NO;


export async function getAvailableBox(req,res) {
    try {
        const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
        if (!apiURL || !apiKey || !deviceNo) {
            return res.status(500).json({ err: "Thiếu cấu hình API hoặc DEVICE_NO" });
        }

        const size = req.body?.size;

        if (!size) {
            return res.status(400).json({ error: "Thiếu tham số size" });
        }

        const data = {
            oType: "1010",
            apiKey: apiKey,
            param: {
                deviceNo: deviceNo,
                size: size,
                type: "0",
            },
        };

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        res.json(response.data);
    } catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
    }
}

export async function countAvailableBox(req,res) {
    try {
        const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
        if (!apiURL || !apiKey || !deviceNo) {
            return res.status(500).json({ err: "Thiếu cấu hình API hoặc DEVICE_NO" });
        }

        const size = req.body?.size;
        if (!size) {
            return res.status(400).json({ error: "Thiếu tham số size" });
        }

        const data = JSON.stringify({
            oType: "1004",
            apiKey: apiKey,
            param: { deviceNo },
        });

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        const boxList = response.data.value[0].box;
        const availableBox = boxList.filter(
            (item) =>
                item.size === Number(size) && item.storage === 0 && item.status === 0
        );

        res.json(availableBox.length);
    } catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
    }
}

export async function openBox(req,res) {
    try {
        const { apiURL, apiKey, deviceNo } = getSmartLockerConfig();
        if (!apiURL || !apiKey || !deviceNo) {
            return res.status(500).json({ err: "Thiếu cấu hình API hoặc DEVICE_NO" });
        }
        const boxNo = req.body?.boxNo;
        console.log(req.body);
        if (!boxNo) {
            return res
                .status(400)
                .json({ code: -2, message: "Thiếu tham số boxNo" });
        }

        const data = JSON.stringify({
            oType: "1009",
            apiKey: apiKey,
            param: {
                deviceNo: deviceNo,
                boxNo: boxNo,
            },
        });

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        console.log(response.data);
        res.json(response.data);
    } catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res
            .status(500)
            .json({ code: -1, message: "Không thể kết nối tới máy chủ AITUO" });
    }
}
