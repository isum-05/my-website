const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    githubId:String,
    name:String,
    email:String,

    coins:{
        type:Number,
        default:0
    },

    level:{
        type:Number,
        default:0
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("User",userSchema);