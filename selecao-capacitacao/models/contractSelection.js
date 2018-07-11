var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

let contractSelectionSchema = Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },
    selectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Selection'
    },
});

let ContractSelection = mongoose.model('ContractSelection', contractSelectionSchema);
module.exports = ContractSelection;