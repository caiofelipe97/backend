/**
 * Created by treinamento-09 on 07/03/18.
 */
//Author: Wesley Gonçalves Anibal

var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const baseOptions = {
    discriminatorKey: 'type',
    collection: 'users'
};

var userSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },

    //email @ccc.ufcg.edu.br
    email: {
        type: String,
        required: true
    },

    password: {
        type:String,
        default: '12345678',
        select: false
    },
    type:{
        type: String
    }
}, baseOptions);

userSchema.pre('save', function (next) {
    let user = this;
    if(!user.password) next();
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});
var User = mongoose.model('User', userSchema);

module.exports = User;