/**
 * Created by treinamento-09 on 07/03/18.
 */
//Author: Wesley Gonçalves Anibal
var express = require('express');
var router = express.Router();
const tokenValidator = require('../util/token.validator');
var UserController = require('../controllers/user.controller');

/* GET home page. */
router.get('/getUser', tokenValidator , UserController.getUser);

module.exports = router;
