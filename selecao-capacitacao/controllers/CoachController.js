var Coach = require('../models/coach.js');
var CoachRating = require('../models/coachRating.model');
let contractController = require('../controllers/contractController');
const mongoose = require('mongoose');

exports.index = function(callback) {
    Coach.find({}).populate('contrato').then(function(coaches) {
        callback({result: coaches, status: 200});
    }).catch(err => callback({result: err.message, status: err.status}));
};


exports.show = function(body, callback) {
    Coach.findById(body).populate('contrato').then(function(coach) {
        callback({result: coach, status: 203});
    }).catch(err => callback({result: err.message, status: err.status}));
};

exports.create = function(body, callback) {
    Coach.find({email: body.email}, function(error, coach) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            if (!coach[0]) {
                new Coach(body).save(function(error, usuario){
                    if (error) {
                        callback({result: error.message, status: 400});
                    } else {
                        callback({result: "Sucesso.", status: 200});
                    }
                });
            } else {
                callback({result: "Coach já cadastrado.", status: 400});
            }
        }
    });



}

exports.update = function(id, body, callback) {
    Coach.findById(id, function(error, coach) {
        if (coach) {
            if (body.nome)          coach.nome = body.nome;
            if (body.email)         coach.email = body.email;
            if (body.emailPessoal)  coach.emailPessoal = body.emailPessoal;
            if (body.telefones)     coach.telefones = body.telefones;
            if (body.contrato)      coach.contrato = body.contrato;
            if (body.dataInicio)    coach.dataInicio = body.dataInicio;
            coach.save(function(saveError) {
                if (saveError) {
                    callback({result: saveError.message, status: 400});
                } else {
                    callback({result: coach, status: 200});
                }
            });
        } else {
            callback({result: "Coach não encontrado.", status: 404});
        }
    });
}

exports.delete = function(id, callback) {
    Coach.remove({ _id: id }, function(error) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: "Coach removido.", status: 200});
        }
    });
}

exports.getCoachRating = async function (req,res){
    const studentId = mongoose.Types.ObjectId(req.params.studentId);
    const selectionId = mongoose.Types.ObjectId(req.params.selectionId);
    const coachId = req.userId;
    CoachRating.find({studentId:studentId, selectionId:selectionId, coachId: coachId}).populate("coachId").then((coachRating)=>{
        if(!coachRating){
            return res.status(200).json({message:"Coach não encontrado", status: 404});
        }else{
            return res.status(200).json({data:coachRating, status:200});
        }
    })
};

exports.getStudentCoachRating = async function (req,res){
    const studentId = mongoose.Types.ObjectId(req.params.studentId);
    const selectionId = mongoose.Types.ObjectId(req.params.selectionId);
    const coachId = mongoose.Types.ObjectId(req.params.coachId);
    CoachRating.find({studentId:studentId, selectionId:selectionId, coachId: coachId}).populate("coachId").then((coachRating)=>{
        if(!coachRating){
            return res.status(200).json({message:"Coach não encontrado", status: 404});
        }else{
            return res.status(200).json({data:coachRating, status:200});
        }
    })
};

exports.postCoachRating = function (req,res){
    const studentId = mongoose.Types.ObjectId(req.params.studentId);
    const selectionId = mongoose.Types.ObjectId(req.params.selectionId);
    const coachId = req.userId;
    CoachRating.findOne({studentId:studentId, selectionId:selectionId, coachId: coachId}).then((coachRating)=>{
        if(!coachRating){
            new CoachRating({
                "studentId": studentId,
                "selectionId": selectionId,
                "coachId": coachId,
                "interview": req.body['interview'],
                "exam": req.body['exam'],
                "curriculum": req.body['curriculum'],
            }).save(function (err) {
                if (err) {
                    return res.status(400).json({message:err, status: 400});
                }
                else return res.status(200).json({message: "Avaliação feita com sucesso!", status:200});
            });
        }else {
            coachRating.interview = req.body['interview'];
            coachRating.exam = req.body['exam'];
            coachRating.curriculum = req.body['curriculum'];
            coachRating.save(function (err) {
                if (err) {
                    return res.status(400).json({message: err, status: 400});
                }
                else return res.status(200).json({message: "Avaliação feita com sucesso!", status: 200});
            })
        }

    })

};

exports.getById = function(id, callback) {
    Coach.find({_id: id}, function(error, coach) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            console.log("Coach", coach);
            if (!coach[0]) {
                callback({result: "Coach não encontrado.", status: 404});
            } else {
                var coachDTO = {
                    favoriteStudents: coach[0].favoriteStudents,
                    _id: coach[0]._id
                };
                callback({result: coachDTO, status: 203});
            }
        }
    });
};


exports.addFavoriteStudents = function (id,coachId,callback) {

    Coach.findById(coachId, function (error, coach) {
        if(!error){
            var index = coach.favoriteStudents.indexOf(id);
            if(index != -1){
                coach.favoriteStudents.splice(index, 1);
            }else{
                coach.favoriteStudents.push(id);
            }


            coach.save(function (error) {
                if(!error){
                    callback({result: "Favoritado com sucesso.", status: 200});
                } else {
                    callback({result: error.message, status: 400});
                }
            });
        } else {
            callback({result: error.message, status: 400});
        }

    })

};