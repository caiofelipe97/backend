//Author: Wesley Gonçalves Anibal
var Aluno = require('../models/student.model.js');
var User = require('../models/user.model');
var multer = require('multer');
const jwt = require('jsonwebtoken');



var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/uploads/historics');
    },
    filename:function(req,file,cb){
        cb(null,req.userId +'.pdf');
    }
});


var upload = multer({storage:store}).single('file');


exports.editPdfAndStudent = async function (req, res) {
    let studentUpdated = req.body;
    upload(req,res, async function(err) {
            if (err) {
                return res.status(501).json({error: err});
            }
            Aluno.findByIdAndUpdate(req.userId, studentUpdated, (err, student) => {
                if (err) {
                    return res.status(400).json({message: "Usuário não encontrado", status: 400});
                }
                return res.status(201).json({message: "Aluno editado com sucesso", status: 201, data: {
                    name: studentUpdated.name
                }
                });
            });
        })
};
exports.editStudent = async function (req, res) {
    let studentUpdated = req.body;
    Aluno.findByIdAndUpdate(req.userId, studentUpdated, (err, student) => {
        if (err) {
            return res.status(400).json({message: "Usuário não encontrado", status: 400});
        }
        return res.status(201).json({message: "Aluno editado com sucesso", status: 201, data: studentUpdated.name});
    });

};

exports.createStudent = async function (req, res) {

    return upload(req,res, async function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        let user = await User.findById(req.userId);
        if(!user){
            return res.status(400).json({message:"Usuário não encontrado", status:400});
        }
        user.remove();
        req.body.academicHistory = './public/uploads/historics/' + req.userId +'.pdf';
        req.body._id = req.userId;
        let newStudent = new Aluno(req.body);
        newStudent.save((err, student)=>{
            if(err){
                return res.status(400).json({message:"Falha na operacao", status:400});
            }else{
                let token = jwt.sign({id: student._id, type: student.type}, process.env.JWT_SECRET_KEY, {expiresIn: 86400});
                return res.status(201).json({message:"Aluno adicionado com sucesso", status:201, data: {
                    name: student.name,
                    token: token,
                    type: student.type
                }
                });
            }
        })

    });
};

exports.getAluno = function (req, res) {
        Aluno.findById(req.params.id, (err, student)=>{
            if(err){
                res.status(400).json({message:"Falha na operação", status:400});
            }else{
                if(student == null ){
                    res.status(404).json({message:" Aluno não encontrado", status: 404});
                }else{
                    if(!student.disabled){
                        res.status(200).json({message:"Aluno encontrado com sucesso",status:200,data:student});
                    }else{
                        res.status(200).json({message:"Aluno possui conta desativada",status:201,data:student});
                    }
                }
            }

        })
};

exports.getAlunos = function (req, res) {
    Aluno.find({}, (err, students)=>{
        if(err){
            res.status(400).json({message:"Falha na operação", status:400});
        }else{
            res.status(200).json({message:"Alunos encontrados com sucesso",status:200,data:students});
        }

    })
};


exports.deleteAluno = function (req, res) {
        Aluno.findById(req.body.id, (err, student)=>{
            if(err){
                res.status(400).json({message:"Falha na operação", status:400});
            }else{
                if(student == null){
                    res.status(404).json({message:" Aluno não encontrado", status: 404});
                }else{
                    student.remove();
                    res.status(200).json({message:"Aluno removido com sucesso", status:200});
                }
            }

        })
};

function atualizarAluno(student){
    student.save(function(saveError) {
        if (saveError) {
            res.status(404).json({message:" Aluno não encontrado", status: 404});
        } else {
            res.status(200).json({message:"Aluno reativado com sucesso", status:200});
        }
    });
}

exports.reativarContaAluno = function (req, res) {
    Aluno.findById(req.body.alunoId, function(error, student) {
        if (student) {
            student.disabled = false;
            student.save(function(saveError) {
                if (saveError) {
                    res.status(404).json({message:" Aluno não encontrado", status: 404});
                } else {
                    res.status(200).json({message:"Aluno reativado com sucesso", status:200});
                }
            });
        } else {
            res.status(404).json({message:" Aluno não encontrado", status: 404});
        }
    });
};

exports.desativarContaAluno = function (req, res) {
    Aluno.findById(req.body.alunoId, function(error, student) {
        if (student) {
            if (!req.disabled)  student.disabled = true;
            student.save(function(saveError) {
                if (saveError) {
                    res.status(404).json({message:" Aluno não encontrado", status: 404});
                } else {
                   res.status(200).json({message:"Aluno removido com sucesso", status:200});
                }
            });
        } else {
            res.status(404).json({message:" Aluno não encontrado", status: 404});
        }
    });
}

exports.getAlunoByGoogleId = function (req, res) {
        Aluno.find({"googleId": req.params.googleId}, (err, student)=>{
            if(err){
                res.status(400).json({message:"Falha na operação", status:400});
            }else{
                if(student == null){
                    res.status(404).json({message:" Aluno não encontrado", status: 404});
                }else{
                    res.status(200).json({message:"Aluno encontrado com sucesso",status:200,data:student});
                }
            }
        })
};