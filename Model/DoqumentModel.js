const mongoose = require('mongoose');

const doqumentSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select: false
    },
    content:{
        type : Object,
        
        
    },
    createAT:{
        type:Date,
        default:Date.now
    },
   
    lastupdateAT:{
        type:Date,
        default:Date.now
    },
  
});

module.exports = mongoose.model("files", doqumentSchema);