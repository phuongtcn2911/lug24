// server.js (phiên bản ESM - chạy được cả local và Vercel)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import các nhóm API (nhớ thêm .js ở cuối)
import lockerRoutes from "./routes/locker.js";
import orderRoutes from "./routes/order.js";
import otpRoutes from "./routes/otp.js";

// Cấu hình môi trường
dotenv.config();

// Khởi tạo app
const app = express();
app.use(cors());
app.use(express.json());

// Gắn nhóm API
app.use("/api", lockerRoutes);
app.use("/api", orderRoutes);
app.use("/api", otpRoutes);

// Khi chạy trên local (không phải production) thì listen cổng
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`✅ Local backend running on port ${port}`);
  });
}

// Khi deploy lên Vercel thì export app (Serverless dùng cái này)
export default app;