let express = require("express");
let router = express.Router();
let selectionController = require("../controllers/Selection.controller");
const tokenValidator = require('../util/token.validator');
let url = require("url");

/* GET users listing. */
router.get('/', function (req, res) {
    selectionController.index( function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

router.get('/getSelectionById/:id', function (req, res) {
    selectionController.show( req.params.id, function (cb) {
     res.status(cb.status).json(cb.result)
    });
});

router.post("/", function(req, res){
    selectionController.save(req.body, function(cb){
        res.status(cb.status).send(cb);
    });
});

//Update
router.post("/repost/:id", function (req, res){
    selectionController.update(req.params.id, req.body, function (cb){
        res.status(cb.status).json(cb.result);
    })
});

// Delete
router.delete('/:id', function (req, res) {
    selectionController.delete(req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});


/*Alterar metodos com rota /:id para receber um nome de rota anterior a isso para
* não confundir com outras rotas*/

router.post('/createSelection',tokenValidator,selectionController.createSelecao);
router.get('/getStudentsSelections/:studentId',selectionController.getStudentSelections);
router.get('/getSelectionStudents/:selectionId',tokenValidator,selectionController.getSelectionStudents);
router.post('/selectionRegister',tokenValidator, selectionController.selectionRegister);
router.get('/openedSelections', selectionController.openedSelections);
router.post('/deleteSelectionStudent', tokenValidator,selectionController.removeSelectionStudent);

module.exports = router;
