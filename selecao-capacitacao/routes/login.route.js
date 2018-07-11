let express = require('express');
let LoginController = require('../controllers/login.controller');
let router = express.Router();
const googleTokenValidator = require('../util/googleToken.validator');
const tokenValidator = require('../util/token.validator');


router.post('/googleLogin', googleTokenValidator, LoginController.googleLogin);

router.post('/login', function (req, res) {
  LoginController.userLogin(req, res, function(cb){
      res.status(cb.status).json(cb.result);
    })
});

module.exports = router;