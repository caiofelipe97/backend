//Author: Wesley Gonçalves Anibal

var mongoose = require('mongoose');
const User = require('./user.model');

var studentSchema = User.discriminator('student', new mongoose.Schema({


    phone: {
        type: String,
        default: ''
    },

    phoneAlt:{
        type: String,
        default: ''
    },

    personalEmail: {
        type: String,
        default: ''
    },

    course: {
        type:String,
        required: true
    },

    currentSemester: {
        type: Number,
        required: true
    },

    endSemester: {
        type: Number,
        required: true
    },

    cra: {
        type:Number,
        required: true
    },

    lattes: {
        type: String
    },

    linkedin: {
        type: String
    },


    //rota do arquivo enviado pelo aluno
    academicHistory: {
        type: String
    },

    //Caso a conta esteja desativada.
    disabled:{
        type: Boolean,
        default: false
    }


}));
var Student = mongoose.model('student');
module.exports = Student;