let jwt = require('jsonwebtoken');



function verifyTokenEnv(req, res, next) {
    let token = req.headers.authorization;
    if (!token) return res.status(400);
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if(err) return res.status(400);
        req.userId = decoded.id;
        //req.type = decoded.type;
        next();
    })
}

module.exports = verifyTokenEnv;

