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
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'user', 
        required: true,
        
    },
    lastupdateAT:{
        type:Date,
        default:Date.now
    },
    updateBy:[
        {
       user:{
        type: mongoose.Schema.ObjectId,
        required: true,
        
        },
        
       updateAT:{
        type:Date,
        default:Date.now
       }
    }
    ]
});

module.exports = mongoose.model("files", doqumentSchema);