const { json } = require('express');
const jwt = require('jsonwebtoken')


const middlewareController = {

    verifyToken: (req , res , next)=>{
        console.log("middlewareController - verify token")
        const token = req.headers.token;
       
        
        if(token){
            const accessToken = token.split(" ")[1];
            console.log("from header - access token : " ,accessToken)
            jwt.verify(accessToken, process.env.ACCESS_KEY, (error, user)=>{
                if(error){
                    console.log("middlewareController - error")
                    res.status(403).json("wrong token ");
                   
                }else{
                    
                    req.user = user;
                    console.log(req.user)
                    console.log("middlewareController verifytoken - next")
                    next();
                }
                

            })

        }else{ 
            console.log("middlewareController - have no token")
            res.status(403).json("have no token ");
        }
    }
    ,
    verifyAdminToken: (req , res , next )=>{
        console.log("middlewareController - start verify admin token")
        middlewareController.verifyToken(req , res, ()=>{
           
            if(req.user.id == req.params.id || req.user.admin ){
                next();
            }
            else{
                res.status(403).json("you can't do it ");
            }

        });



    }
}

module.exports = middlewareController;