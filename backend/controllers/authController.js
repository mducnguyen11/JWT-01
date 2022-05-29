const bcrypt = require('bcrypt')
const userSchema = require('../models/user')
const jwt = require("jsonwebtoken")

let refreshTokens = [];
const authController = {
    register: async ( req , res )=>{
        try {

            console.log("auth controler - register")
            const salt = await bcrypt.genSalt(10);

            // console.log("auth controler - register - hash")
            const hashed = await bcrypt.hash(req.body.password , salt);
            // console.log("auth controler - register - done hashed")
            const newUser = await new userSchema({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            })
            // console.log("auth controler - register - created schema")
            const user = await newUser.save();

            // console.log("auth controler - registed - save")
            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json(error);
        }
    },

    genarateAccessToken : (user)=>{
        const accessToken = jwt.sign({
            id: user.id,
            password: user.password
        },process.env.ACCESS_KEY,{
            expiresIn: "30s"
        })

        return accessToken;
    }

    ,
    generateRefreshToken : (user)=>{
        const accessToken = jwt.sign({
            id: user.id,
            password: user.password
        },process.env.ACCESS_KEY,{
            expiresIn: "365d"
        })

        return accessToken;
    }



    ,
    login: async (req, res )=>{
        console.log("login controller")
        try {
            console.log("find user : ", req.body.username)
            const user = await userSchema.findOne({username: req.body.username})
           
            if(!user){
                return res.status(404).json("Wrong user name")
            }else{
                const validPassword = await bcrypt.compare(req.body.password , user.password )

                if(!validPassword){
                    return res.status(404).json("Wrong pass word")
                }else{
                    console.log("login controller - start create jwt token ")
                    const accessToken = jwt.sign({
                        id: user.id,
                        password: user.password
                    },process.env.ACCESS_KEY,{
                        expiresIn: "30s"
                    })

                    const refreshToken = jwt.sign({
                        id: user.id,
                        password: user.password
                    },process.env.ACCESS_KEY,{
                        expiresIn: "365d"
                    })
                    refreshTokens.push(refreshToken)
                    res.cookie("refreshToken", refreshToken,{
                        httpOnly: true,
                        secure: false,
                        path:'/',
                        sameSite:"strict"

                    })
                    console.log("login controller - have created jwt token ")
                    // user.accessToken = accessToken;
                    const {password , ...others } = user._doc;
                    
                    console.log("login controller - send response ")
                   return res.status(200).json({...others, accessToken , refreshToken})
                }
            }
            
        } catch (error) {
             return res.status(500).json(error)
        }
    },

    requestRefreshToken: (req, res)=>{

        console.log("auth controller - requestRefreshToken")
        const refreshToken = req.cookies.refreshToken;
        console.log("requestRefreshToken - from refToken: ", refreshToken)
        
        if(!refreshToken){
            return res.json("Have no token")
        }
        if(!refreshTokens.includes(refreshToken)){
            return res.json("refresh token is not valid")
        }
        jwt.verify(refreshToken, process.env.ACCESS_KEY, (error,user)=>{
            if(error){
                return res.json("Wrong token")
            }
            refreshTokens = refreshTokens.filter((a) => a!== refreshToken); 
            const newAccessToken = authController.genarateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);

            refreshTokens.push(newRefreshToken)
            
            res.cookie("refreshToken", newRefreshToken,{
                httpOnly: true,
                secure: false,
                path:'/',
                sameSite:"strict"

            })
           return  res.json({accessToken: newAccessToken})
        })




    },

    logout: async (req , res )=>{
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((a)=> a!== req.cookies.refreshToken);
        res.json("logouted")
    }

}

module.exports = authController;