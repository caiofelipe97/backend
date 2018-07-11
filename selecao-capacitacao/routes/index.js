
const express = require('express');
const router = express.Router();
const login = require('./login.route');
const student = require('./student.route');
const coach = require('./coach');
const gestor = require('./gestor');
const user = require ('./user.route');
const selection = require('./selection');
const contract = require('./contract');

router.use('/login', login);
router.use('/student', student);
router.use('/user', user);
router.use('/coach', coach);
router.use('/gestor', gestor);
router.use('/selection', selection);
router.use('/contract', contract);

module.exports = router;
