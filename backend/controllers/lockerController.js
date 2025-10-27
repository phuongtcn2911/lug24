const axios = require("axios");

const apiURL = process.env.SMARTLOCKER_API;
const apiKey = process.env.SMARTLOCKER_TOKEN;
const deviceNo = process.env.DEVICE_NO;


exports.getAvailableBox = async (req, res) => {
    try {
        const size = req.body?.size || req.query?.size;

        if (!size) {
            return res.status(400).json({ error: "Thiếu tham số size" });
        }

        const data = JSON.stringify({
            oType: "1010",
            apiKey: apiKey,
            param: {
                deviceNo: deviceNo,
                size: size,
                type: "0",
            },
        });

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        res.json(response.data);
    } catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });
    }
};

exports.countAvailableBox = async (req, res) => {
    try {
        const size = req.body?.size || req.query?.size;
        if (!size) {
            return res.status(400).json({ error: "Thiếu tham số size" })
        }
        const data = JSON.stringify({
            oType: "1004",
            apiKey: apiKey,
            param: {
                deviceNo: deviceNo
            }
        });

        const response = await axios.post(apiURL, data, {
            headers: { "Content-Type": "application/json" },
        });

        var boxList = response.data.value[0].box;

        var avaibleBox = boxList.filter(function (item) {
            return (item.size === Number(size) && item.storage === 0 && item.status === 0);
        });

        res.json(avaibleBox.length);
    } catch (err) {
        console.error("Lỗi khi gọi API AITUO: ", err.message);
        res.status(500).json({ err: "Không thể kết nối tới máy chủ AITUO" });

    }
};

exports.openBox = async (req, res) => {
    try {
        const boxNo = req.body?.boxNo;
        console.log(req.body);
        if (!boxNo) {
            return res.status(400).json({ code: -2, message: "Thiếu tham số boxNo" })
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
        res.status(500).json({ code: -1, message: "Không thể kết nối tới máy chủ AITUO" });
    }

};





