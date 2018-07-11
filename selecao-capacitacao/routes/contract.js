var express = require("express");
var router = express.Router();
var contractController = require("../controllers/contractController");
var multer = require('multer');

//Personal storage
var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/uploads/contract_images');
    },
    filename:function(req,file,cb){
        console.log(file);
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
});

var upload = multer({storage:store});

/* GET all*/
router.get('/', function (req, res) {
    contractController.index( function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

router.get('/selections/:id', function(req, res) {
    contractController.getContractSelections( req.params.id, function (cb) {
        console.log(cb);
        res.status(cb.status).json(cb.result);
    });
});

router.post('/', upload.single('file'), function (req, res, next) {
    contractController.create(req, function(resposta){
        console.log(resposta);
        res.status(resposta.status).send(resposta);
    });
});

// Update
router.post('/:id', upload.single('file'), function (req, res) {
    contractController.update( req.params.id, req, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

router.get('/students/:id', function(req, res) {
    contractController.getContractStudents( req.params.id, function (cb) {
        res.status(cb.status).json(cb.result);
    });
});


// Get(id)
router.get('/single/:id', function (req, res) {
    contractController.show( req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Delete
router.delete('/:id', function (req, res) {
    contractController.delete(req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});


//Métodos para teste
/*
router.get('/', function (req, res) {
    res.render('index', {title: 'Upload'});
})
*/

/*router.post('/', function(req, res){
    contractController.save(req.body, function(resposta){
        res.status(resposta.status).send(resposta);
    });
});*/

module.exports = router;
