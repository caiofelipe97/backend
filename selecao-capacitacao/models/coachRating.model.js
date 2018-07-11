/**
 * Created by treinamento-09 on 20/03/18.
 */
//Author: Wesley Gonçalves Anibal

let mongoose = require('mongoose');

let coachRatingSchema = mongoose.Schema({


    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    selectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Selection'
    },
    coachId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coach'
    },
    curriculum:{
        type: Number,
        max:5,
        min:0,
        default:0
    },
    interview:{
        type: Number,
        max:5,
        min:0,
        default:0
    },
    exam:{
        type: Number,
        max:5,
        min:0,
        default:0
    }



});

coachRatingSchema.index({studentId: 1, selectionId: 1, coachId:1}, {unique: true});

let CoachRating = mongoose.model('CoachRating', coachRatingSchema);
module.exports = CoachRating;