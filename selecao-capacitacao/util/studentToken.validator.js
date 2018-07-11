let jwt = require('jsonwebtoken');
const config = require('config');
function verifyStudentToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400);
    }

    jwt.verify(token, config.JWT_SECRET_KEY, function (err, decoded) {
        if (err || decoded.type !== "Student") {
            return res.status(400);
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyStudentToken;
