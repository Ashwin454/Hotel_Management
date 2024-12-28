const app=require("./app");
const dotenv=require("dotenv");
const express = require('express')
const { connectDB } = require("./config/database");

dotenv.config({path: "./config/config.env"});

connectDB();

app.listen(8080 , ()=>{
    console.log(`Server is UP.`);
});