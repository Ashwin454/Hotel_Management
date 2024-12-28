const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const router = require("./routes/userRoutes");
const roomsRouter = require('./routes/roomRoutes');
const bookingRouter = require('./routes/bookingRoutes')
app.set('trust proxy', true);

app.use(cors({
    origin: ['https://hotel-management-2-03dr.onrender.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", router);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/bookings', bookingRouter);

module.exports = app;