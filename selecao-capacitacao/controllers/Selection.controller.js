const Selection = require("../models/selection.model");
const Student = require('../models/student.model');
const StudentSelection = require('../models/studentSelection.model');
const ContractSelection = require('../models/contractSelection');
const Contract = require('../models/contract');
const mongoose = require('mongoose');
const User = require("../models/user.model");

exports.save = function(body, callback) {
    body.tools = body.tools.trim().split(" ");
    let selection = new Selection(body);
    if(selection.startDate < new Date().setHours(0, 0, 0, 0)){
        callback({result: "Data de inicio anterior a data atual", status:400})
    }else if(selection.endDate < new Date()){
        callback({message: "Data de fim anterior a data atual", status:400})
    }else {
        selection.save(function (error, selecao) {
            if (error) {
                callback({result: error, status: 400});
            } else {
                new ContractSelection({selectionId: selecao._id, contractId: selecao.contract}).save(function (error) {
                    if (error) {
                        callback({result: error, status: 400});
                    }
                });
                callback({result: "Adicionado com sucesso", status: 200});
            }
        });
    }
}

exports.show = function (id, callback) {
    Selection.findOne({_id: id}).populate("contract").then(( selection) =>{
        if(!selection){
            callback({result: "Seleção não encontrada", status: 400});
        } else {
            callback({result: selection, status: 200});
        }
    })
}

exports.index = function(callback) {
    Selection.find({}).populate('contract').then(function(selections) {
            callback({result: selections, status: 200});
    }).catch(err => callback({message: err.message, status: err.status}));
}

exports.update = function (id, body, callback) {
    body.tools = body.tools.trim().split(" ");
    Selection.find({'_id': id}, function(error, oldSelection) {
        updateContractSelection(oldSelection, body.contract);
        Selection.findOneAndUpdate({'_id': id}, body, function (err, selection) {
            if (err) callback({message: err.message, status: err.status});
            else callback({message: "Selecao atualizada com sucesso", status: 200});
        });
    });
};

function updateContractSelection (oldSelection, contract){
    body = {
        "selectionId": oldSelection[0]['_id'],
        "contractId": contract,
    };
    ContractSelection.findOneAndUpdate({selectionId: oldSelection[0]['_id'], contractId: oldSelection[0]['contract']}, {$set: body}, {new: true}, function (err, contractSelection) {
        if (err) console.log(err);
        else console.log("novo", contractSelection);
    });
}

/*
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
*/

exports.createSelecao = function(req, res) {
    new Selection(req.body).save(function(error, selecao) {
        if (error) {
            return res.status(400).json({message:error, status: 400});
        } else {
            return res.status(201).json({message:"Selecao Criada com sucesso", status: 400, data: selecao});
        }
    });
};

exports.getStudentSelections = async function (req, res) {
    const studentId = mongoose.Types.ObjectId(req.params.studentId);
    try {
        const student = await Student.findOne({_id:studentId});
        if(!student ) {
            return res.status(404).json({message: "Aluno não encontrado", status: 404});
        }else {
            StudentSelection.find({studentId: studentId}).populate({path : 'selectionId', populate : {path : 'contract'}}).exec(function(err, studentsSelection)
            {
                if(err){
                    return res.status(400).json({message: err, status: 400});
                }else{
                    let selections = studentsSelection.map(studentSelection => studentSelection.selectionId);
                    return res.status(200).json({status: 200, data: selections});
                }
            });
        }
    }catch (err){
        return res.status(400).json({message:err, status: 400});
    }
};

exports.getSelectionStudents = async function (req, res) {
    const selectionId = mongoose.Types.ObjectId(req.params.selectionId);
    try {
        const selection = await Selection.findOne({_id:selectionId});
        if(!selection ) {
            return res.status(404).json({message: "Seleção não encontrada", status: 404});
        }else {
            StudentSelection.find({selectionId: selectionId}).populate('studentId').exec(function(err, studentsSelection)
            {
                if(err){
                    return res.status(400).json({message: err, status: 400});
                }else{
                    let students = studentsSelection.map(studentSelection => studentSelection.studentId);
                    return res.status(200).json({status: 200, data: students});
                }
            });
        }
    }catch (err){
        return res.status(400).json({message:err, status: 400});
    }
};



exports.selectionRegister = async function(req, res){
    const studentId = mongoose.Types.ObjectId(req.body.studentId);
    const selectionId = mongoose.Types.ObjectId(req.body.selectionId);
    try{
        const student = await Student.findOne({_id:studentId});
        const selection = await Selection.findOne({_id: selectionId});
        if(!student ){
            return res.status(404).json({message:" Aluno não encontrada", status: 404});
        }else if(!selection){
            return res.status(404).json({message:" Seleção não encontrada", status: 404});
        }else{
            new StudentSelection({studentId: student._id, selectionId: selection._id}).save().then(()=>{
                return res.status(201).json({message:"Aluno registrado na seleção", status: 201});
            }).catch(()=>{
                return res.status(400).json({message:"Já existe um aluno cadastro nessa seleção", status: 400});
            })
        }
    } catch (err) {
        return res.status(400).json({message:err, status: 400});
    }

};


exports.openedSelections = function(req,res) {
    Selection.find({state: true}).populate('contract').exec(function(error, selections) {
        if (error) {
            return res.status(400).json({message:error, status: 400});
        } else {
            return res.status(200).json({status: 200, data: selections});
        }
    });

};

exports.delete = function(id, callback) {
    Selection.remove({ _id: id }, function(error) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: "Seleção removida.", status: 200});
        }
    });
};

exports.removeSelectionStudent = async function(req, res){
    const studentId = req.userId;
    const selectionId = mongoose.Types.ObjectId(req.body.selectionId);
    try{
        const student = await Student.findOne({_id:studentId});
        const selection = await Selection.findOne({_id: selectionId});
        if(!student ){
            return res.status(404).json({message:" Aluno não encontrada", status: 404});
        }else if(!selection){
            return res.status(404).json({message:" Seleção não encontrada", status: 404});
        }else{
            StudentSelection.remove({studentId: student._id, selectionId: selection._id}, (err, selection)=>{
                if(err){
                    res.status(400).json({message:"Falha na operação", status:400});
                }else{
                    if(selection == null){
                        res.status(404).json({message:" Seleção não encontrado", status: 404});
                    }else{
                        res.status(200).json({message:"Seleção removida com sucesso", status:200});
                    }
                }
            });
        }
    } catch (err) {
        return res.status(400).json({message:err, status: 400});
    }
};
