/**
 * Created by treinamento-09 on 20/03/18.
 */
//Author: Wesley Gonçalves Anibal

let mongoose = require('mongoose');

let studentSelectionSchema = mongoose.Schema({


    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    selectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Selection'
    }

});

studentSelectionSchema.index({studentId: 1, selectionId: 1}, {unique: true});

let StudentSelection = mongoose.model('StudentSelection', studentSelectionSchema);
module.exports = StudentSelection;