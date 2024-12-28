const app=require("./app");
const dotenv=require("dotenv");
const express = require('express')
const { connectDB } = require("./config/database");

dotenv.config({path: "./config/config.env"});

connectDB();

app.listen(8080 , ()=>{
    console.log(`Server is UP.`);
});

const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The following must be placed after all your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
