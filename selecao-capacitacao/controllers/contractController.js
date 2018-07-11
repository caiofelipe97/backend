var Selection = require('../models/selection.model');
const Contract = require('../models/contract');
const mongoose = require('mongoose');
const ContractSelection = require('../models/contractSelection');
const StudentSelection = require('../models/studentSelection.model');

exports.index = function(callback) {
    Contract.find({}, function(error, contract) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: contract, status: 200});
        }
    });
};

exports.show = function(body, callback) {
    Contract.findById(body, function(error, contract) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            if (contract == null) {
                callback({result: "Contrato não encontrado.", status: 404});
            } else {
                callback({result: contract, status: 200});
            }

        }
    });
};

exports.create = function(req, callback) {
    var contract = new Contract();
    contract.name = req.body.name;
    contract.description = req.body.description;
    contract.tools = req.body.tools.trim().split(" ");
    if (req.file) contract.image = req.file.path;
    else contract.image = "public/uploads/contract_images/default.jpg";
    contract.save(function(error){
        if (error) {
            if (error.toString().includes("E11000")){
                callback({result: "Duplicate name", status: 400});
            }
            else callback({result: error.message, status: 400});
        } else {
            callback({result: "Sucesso.", status: 200});
        }
    });
};

exports.update = function(id, req, callback) {
    Contract.findById(id, function(error, contract) {
        if (contract) {
            if (req.body.name)          contract.name = req.body.name;
            if (req.body.description)   contract.description = req.body.description;
            if (req.body.tools)         contract.tools = req.body.tools.split(" ");
            if (req.file)               contract.image = req.file.path;
            contract.save(function(saveError) {
                if (saveError) {
                    callback({result: saveError.message, status: 400});
                } else {
                    callback({result: contract, status: 200});
                }
            });
        } else {
            callback({result: "Contrato não encontrado.", status: 404});
        }
    });
};

exports.delete = function(id, callback) {
    Contract.remove({ _id: id }, function(error) {
        if (error) {
            callback({result: error.message, status: 400});
        } else {
            callback({result: "Contrato removido.", status: 200});
        }
    });
};

exports.getContractSelections = async function(contractID, callback) {
    const contractId = mongoose.Types.ObjectId(contractID);

    try {
        const contract = await Contract.findOne({_id: contractId});
        if (!contract) {
            callback({message: "Contrato não encontrado", status: 404});
        } else {

            ContractSelection.find({contractId: contractId}).populate({path : 'selectionId', populate : {path : 'contract'}}).exec(function (err, selectionsContract) {
                if (err) {
                    callback({message: err, status: 400});
                } else {
                    let selections = selectionsContract.map(selectionsContract => selectionsContract.selectionId);
                    callback({status: 200, result: selections});
                }
            });
        }
    } catch (e) {
        return callback({message:e, status: 400});
    }
};

// exports.findByName = function (body, callback) {
//     Contract.find({"name": body}, function(error, contract) {
//         if (error) {
//             callback({result: error.message, status: 400});
//         } else {
//             if (contract == null) {
//                 callback({result: "Contrato não encontrado.", status: 404});
//             } else {
//                 callback({result: contract[0]._id, status: 200});
//             }
//         }
//     });
// };

//Returns all students linked to the contract
exports.getContractStudents = async function(contractID, callback) {

    const contractId = mongoose.Types.ObjectId(contractID);
    let result = [];
    try {
        const contract = await Contract.findOne({_id: contractId});
        if (!contract) {
            callback({message: "Contrato não encontrado", status: 404});
        } else {
            ContractSelection.find({contractId: contractId}).populate('selectionId').then(function (selectionsContract) {

                let selections = selectionsContract.map(selectionsContract => selectionsContract.selectionId);
                let promises = [];
                selections.forEach(function (selection) {
                    promises.push(StudentSelection.find({selectionId: selection._id}).populate('studentId').then(function (studentSelections) {
                            let students = studentSelections.map(studentSelection => studentSelection.studentId);
                            result = result.concat(students);
                    }))
                });
                Promise.all(promises).then(resolve => callback({result: result, status: 200}));

            });
        }
    } catch (e) {
        return callback({message:e, status: 400});
    }
};
