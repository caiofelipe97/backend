var express = require("express");
var router = express.Router();
var gestorController = require("../controllers/GestorController");
var url = require("url");

/* GET users listing. */
router.get('/', function (req, res) {
    gestorController.index( function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

router.post("/", function(req, res){
  gestorController.save(req.body, function(resposta){
	 res.status(resposta.status).json(resposta.result);
	});
});

router.get('/:id', function (req, res) {
    gestorController.show(req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Delete
router.delete('/:id', function (req, res) {
    gestorController.delete(req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

module.exports = router;
