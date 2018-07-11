var Gestor = require("../models/gestor");

exports.save = function(body, callback) {

    Gestor.find({email: body.email}, function(error, gestor) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            if (!gestor[0]) {
                new Gestor(body).save(function(error, usuario) {

                    if (error) {
                        callback({result: error, status: 400});
                    } else {
                        callback({result: "Adicionado com sucesso", status: 200});
                    }

                });
            } else {
                callback({result: "Gestor já cadastrado", status: 400});
            }
        }
    });

}


exports.index = function(callback) {
    Gestor.find({}, function(error, gestor) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: gestor, status: 200});
        }
    });

}

exports.show = function(body, callback) {
    Gestor.findById(body, function(error, gestor) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            if (gestor == null) {
                callback({result: "Coach não encontrado.", status: 404});
            } else {
                callback({result: gestor, status: 200});
            }

        }
    });
}

exports.delete = function(id, callback) {
    Gestor.remove({ _id: id }, function(error) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: "Gestor removido.", status: 200});
        }
    });
}


