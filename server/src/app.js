const express = require("express");
const app = express();
const cors = require("cors");
const { FRONTEND_ORIGIN } = require("../config/config.js");

app.use(cors({
    origin:FRONTEND_ORIGIN,
    credentials:true
}));    
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/", (req, res)=>{
    res.json("Default page");
})

module.exports = app ;