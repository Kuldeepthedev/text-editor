const mongoose = require('mongoose')
require('dotenv').config()

const dbconnect = async ()=>{
    try{
        await mongoose.connect(process.env.DB_PATH)
        
        console.log("connected to databse")
    }
    catch(error){
        console.log("Error connecting to the database")
    }
}
module.exports = dbconnect; 