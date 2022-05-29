const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const userSchema = require("./models/user")
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

const cookieParser = require("cookie-parser");
const connect = require('./connectDb')

connect();
const app = express();
app.use(cookieParser())
app.use(cors())
app.use(express.json())
dotenv.config();


app.use("/auth", authRouter)
app.use("/", usersRouter)


app.listen(8000, ()=>{
    console.log("Sever is running ... ")

})



