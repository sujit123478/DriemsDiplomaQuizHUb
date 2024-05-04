const mongoose = require('mongoose');
const userSchema =mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    RegistrationNumber: {
        type: String,
        required:true
    },
    isAdmin:{
        type: Boolean,
        default:false
    }
},{
    timestamps:true
});
const userModel=mongoose.model('users',userSchema);
module.exports=userModel;