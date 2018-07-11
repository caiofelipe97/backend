/**
 * Created by treinamento-09 on 28/02/18.
 */
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "933857491001-v5l5ocqk79otrpt9hhqimhttedvkcjsc.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
async function verify(req, res, next) {
    let token = req.body.id_token;
    await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    }).then(()=>{
        next();
    }).catch(() => {
        return res.status(400).json({
            message: "Authentication Failed"
        });
    });
}

module.exports = verify;