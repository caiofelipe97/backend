/**
 * Created by treinamento-09 on 07/03/18.
 */
let User = require('../models/user.model.js');

exports.getUser = function (req,res){
    const userId = req.userId;
    User.findById(userId, function(err, user) {
        if (err) {
            return res.status(400).json({message:"Falha na operação", status:400});
        } else {
            if (user == null) {
                return res.status(404).json({message:"Usuário não encontrado", status: 404});
            } else {
                return res.status(200).json(user);
            }

        }
    });
}
