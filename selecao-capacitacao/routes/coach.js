var express         = require('express');
var router          = express.Router();
var CoachController = require('../controllers/CoachController.js');
const tokenValidator = require('../util/token.validator');

// Index (get all)
router.get('/', function (req, res) {
    CoachController.index( function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Show (get one)
router.get('/:id', function (req, res) {
    CoachController.show( req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});


// Create
router.post('/', function (req, res) {
    CoachController.create( req.body, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Update
router.put('/:id', function (req, res) {
    CoachController.update( req.params.id, req.body, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Delete
router.delete('/:id', function (req, res) {
    CoachController.delete(req.params.id, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

router.get('/getCoachRating/:selectionId/:studentId',tokenValidator, CoachController.getCoachRating);

router.get('/getCoachRating/:selectionId/:studentId/:coachId',tokenValidator, CoachController.getStudentCoachRating);

router.post('/postCoachRating/:selectionId/:studentId', tokenValidator, CoachController.postCoachRating);

// ShowByName (get one)
router.get('/getById/:id', function (req, res) {
    CoachController.getByEmail( req.params.email, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

// Update
router.put('/addFavoriteStudents/:id',tokenValidator, function (req, res) {

    const coachId = req.userId;
    CoachController.addFavoriteStudents(req.params.id, coachId, function(cb) {
        res.status(cb.status).json(cb.result);
    });
});

module.exports = router;