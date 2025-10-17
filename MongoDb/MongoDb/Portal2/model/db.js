const mongoose = require('mongoose');

function connectDb(){
    try{
        mongoose.connect('mongodb://localhost:27017/Student_Management_System');
        console.log("Database connected successfully");
    }catch(err){
        console.log("Error in database connection", err);
    }

}
module.exports = connectDb;