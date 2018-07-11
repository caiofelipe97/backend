//Author: Caio Felipe de A. Melo
const User = require('../models/user.model.js');
const Student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

exports.googleLogin = async function (req, res) {
    let newUser = new User(req.body);
    User.findOne({'email': newUser.email}).then(async (user) => {
        if(!user){
            newUser = await newUser.save();
        }else {
            newUser = user;
        }
        Student.findOne({'email': newUser.email}).then(async (student) => {
            if (!student) {
                let token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: 86400});
                return res.status(201).json({
                    data: {
                        message: 'Usuário criado e autenticado com sucessso',
                        token: token,
                        name: newUser.name,
                        firstLogin: true,
                        disabled: false
                    }
                });
            } else {
                let token = jwt.sign({
                    id: student._id,
                    type: student.type
                }, process.env.JWT_SECRET_KEY, {expiresIn: 86400});
                return res.status(200).json({
                    data: {
                        message: 'Usuário autenticado com sucessso',
                        token: token,
                        name: student.name,
                        firstLogin: false,
                        disabled: student.disabled,
                        type: 'student'
                    }
                })
            }
        })

    }).catch(function (e) {
        console.error(e);
        return res.status(500);
    });
};

exports.userLogin = async function (req, res, callback) {
    //----test----
    //------------
    User.findOne({'email': req.body.email}).select("+password").populate('contrato').then((user) => {
        if(!user){
            callback({result: 'User not registed', status: 404});
            /*return res.status(404).json( {
                data: {
                    message: 'User not registed'
                }
            })*/
        } if(!bcrypt.compareSync(req.body.password, user.password)) {
            callback({result: 'User or password wrong', status: 400});
            /*
            return res.status(400).json( {
                data: {
                    message: 'User or password wrong'
                }
            })*/
        } else {
            //----test----
            //------------
            let token = jwt.sign({id: user._id, type: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: 86400});
            let data = {
                message: 'User althentication Sucessfull',
                token: token,
                name: user.name,
                id: user._id,
                type: user.type
            };
            if (user.type === 'coach') data.contract = user.contrato;
            callback({result: data, status: 200});
            /*return res.status(200).json( {
                data: {
                    message: 'User althentication Sucessfull',
                    token: token,
                    name: user.name,
                    id: user._id,
                    type: user.role,
                }
            })*/
        }
    }).catch(function (e) {
        callback({result: e.message, status: 500});
    })
}
