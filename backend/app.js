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
    origin: ['https://hotel-management-2-03dr.onrender.com', 'http://localhost:3000', 'https://hotel-management-sepia-eight.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

const path = require('path');

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// All other routes should serve the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1", router);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/bookings', bookingRouter);

module.exports = app;