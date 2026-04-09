const mongoose = require("mongoose");
const { DB_NAME, DB_URL } = require("./config");

 const ConnectDB = async ()=>{
    try {
        const conn = await mongoose.connect(`${DB_URL}/${DB_NAME}`);
        console.log("DB connect Sucessfully");
        return true;
    } catch (error) {
        console.log("DB not connect: ", error.message);
        return false;
    }

}

module.exports = ConnectDB