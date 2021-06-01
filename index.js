const express = require('express');

const app = express.Router();

const mongoose = require('mongoose');

const PORT = process.env.PORT || 9000;

const mongoDB = "mongodb string";

mongoose.connect(mongoDB,{useUnifiedTopology:true,useFindAndModify:false, useNewUrlParser:true})
const connectDb = mongoose.connection;

connectDb.on('open',()=>{
    console.log("db connected")
})

app.listen(PORT,()=>{
    console.log("port connected")
})

