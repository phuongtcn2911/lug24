// server.js
require('dotenv').config();
const express = require('express');
const cors=require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;


//Import các nhóm API
const lockerRoutes=require('./routes/locker');
const orderRoutes=require('./routes/order');
const otpRoutes=require("./routes/otp");
app.use('/api',lockerRoutes);
app.use('/api',orderRoutes);
app.use('/api',otpRoutes)

// // Tạo route API
// app.get('/api/generate-order-code', (req, res) => {
//   const code = generateOrderCode();
//   res.json({ orderCode: code });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });