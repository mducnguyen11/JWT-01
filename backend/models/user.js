const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        maxlength:50,
        unique:true
    },
    email:{
        type: String,
        required:true,
        maxlength:50,
    },
    password:{
        type: String,
        required:true,
        minlength: 4,
        unique:true
    },
    admin:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


module.exports = mongoose.model("user", userSchema);
