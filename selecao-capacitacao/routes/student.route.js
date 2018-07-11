//Author: Wesley Gonçalves Anibal
var express = require('express');
var router = express.Router();
var AlunoController = require('../controllers/aluno.controller');
const tokenValidator = require('../util/token.validator');

router.get('/getAlunos',tokenValidator,AlunoController.getAlunos);
router.get('/getAluno/:id',tokenValidator,AlunoController.getAluno);
router.delete('/deletarAluno',tokenValidator,AlunoController.deleteAluno);
router.post('/createStudent',tokenValidator, AlunoController.createStudent);
router.post('/editPdfAndStudent/:studentId', tokenValidator, AlunoController.editPdfAndStudent);
router.put('/editStudent', tokenValidator, AlunoController.editStudent);
router.post('/desativarAluno/',tokenValidator, AlunoController.desativarContaAluno);
router.post('/reativarAluno',tokenValidator, AlunoController.reativarContaAluno);

module.exports = router;
