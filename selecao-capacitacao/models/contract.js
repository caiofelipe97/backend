var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var Contract = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required'],
        validate: {
            validator: function(nome){
                return !!nome;
            },
            message: '{VALUE} Invalid name'
        }
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        validate: {
            validator: function(description){
                return !!description;
            },
            message: '{VALUE} Invalid description'
        }
    },

    tools: {
        type: [String],
        required: [true, 'Tools are required'],
        validate: {
            validator: function(tools) {
                return tools.length > 0;
            },
            message: '{VALUE} Tools are required'
        }
    },

    image: {
        type: String,
        required: [false, 'Image is required']
    },

    created: {
        type: Date,
        default: Date.now
    },

    selections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Selection'
    }]
});

module.exports = mongoose.model('Contract', Contract);
