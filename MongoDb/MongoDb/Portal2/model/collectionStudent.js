const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }

})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;