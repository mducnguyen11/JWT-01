const mongoose = require("mongoose");

async function connect(){
    
    try {
        console.log("start")
        mongoose.connect("mongodb://127.0.0.1:27017/jwtuser", () => {
            console.log("Db is connected");
        })
    } catch (error) {
        console.log("Error connect to Db")
    }

}

module.exports = connect;