var mongoose = require('mongoose');

var selectionSchema = mongoose.Schema({

    jobName: {
        type: String,
        required: [true, 'Name is required'],
        validate: {
            validator: function(name){
                return !!name;
            },
            message: '{VALUE} Invalid name'
        }
    },

    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },

    workload: {
        type: Number,
        required: [true, 'Workload is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required']
    },

    scholarshipHolders: {
        type: Number,
        required: [true, 'scholarshipHolders is required'],
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: '{VALUE} needs to be greater than zero'
        }
    },

    assignments: {
        type: Number
    },

    volunteers: {
        type: Number,
        required: [true, 'scholarshipHolders is required'],
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: '{VALUE} needs to be greater than zero'
        }
    },

    tools: [String],

    startDate: {
        type: Date,
        require: [false, "Start date is required"],
        validate: {
            validator: function (startDate) {
                var minDate = new Date(2005, 12, 1);
                var maxDate = new Date(2100, 12, 1);
                return startDate > minDate && startDate < maxDate;
            },
            message: '{VALUE} Invalid date'
        }
    },

    endDate: {
        type: Date,
        require: [false, "End date is required"],
        validate: {
            validator: function (startDate) {
                var minDate = new Date(2005, 12, 1);
                var maxDate = new Date(2100, 12, 1);
                return startDate > minDate && startDate < maxDate;
            },
            message: '{VALUE} Invalid date'
        }
    },
    coach: {
        type: String,
    },
    state:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Selection', selectionSchema);
