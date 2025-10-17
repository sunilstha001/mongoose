const mongoose = require("mongoose");
function connectDB(){
    try{
        mongoose.connect("mongodb://localhost:27017/pratice-database")
        console.log("Database connected successfully");
    }catch(err){
        console.log(err);
    }
}
module.exports = connectDB