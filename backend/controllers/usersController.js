const userSchema = require('../models/user')

const usersController = {

    getAllUsers: async (req, res )=>{
        console.log("Get all users controller ")
        try {
            const users = await userSchema.find({});
            if(users){
                res.status(200).json(users)
            }else{
                res.status(200).json("Have no user")
            }
        } catch (error) {
            res.json(error)
        }
    },
    deleteUser: async (req, res )=>{

        console.log("Delete user controller - id : ", req.params.id )
        try {
            const user = await userSchema.findByIdAndDelete(req.params.id);
            res.json("deleted")
        } catch (error) {
            res.json(error)
        }
    }
}

module.exports = usersController