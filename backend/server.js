// Cấu hình môi trường
import dotenv from "dotenv";
dotenv.config();

// server.js (phiên bản ESM - chạy được cả local và Vercel)
import express from "express";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Import các nhóm API (nhớ thêm .js ở cuối)
import lockerRoutes from "./routes/locker.js";
import orderRoutes from "./routes/order.js";
import otpRoutes from "./routes/otp.js";
import paymentRoutes from "./routes/payment.js";
import zaloRoutes from "./routes/zalo.js";
import i18next from "./routes/i18n.js"

// Khởi tạo app
const app = express();
app.use(cors());
app.use(express.json());



// Gắn nhóm API
app.use("/api", lockerRoutes);
app.use("/api", orderRoutes);
app.use("/api", otpRoutes);
app.use("/api", paymentRoutes);
app.use("/api", zaloRoutes);

// Khi chạy trên local (không phải production) thì listen cổng
if (process.env.NODE_ENV !== "production") {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // Lưu socket vào app để các route khác dùng emit
    app.set("io", io);

    io.on("connection", (socket) => {
        console.log("⚡ Client connected:", socket.id);
    });


    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        console.log(`✅ Local backend running with socket on port ${port}`);
    });
}

// Khi deploy lên Vercel thì export app (Serverless dùng cái này)
export default app;


