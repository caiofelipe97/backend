var mongoose  = require('mongoose');
const user = require('../models/user.model');

var Coach = user.discriminator('coach', mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        validate: {
            validator: function(nome){
                return !!nome;
            },
            message: '{VALUE} Invalid name'
        }
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        validate: {
            validator: function(lastName){
                return !!lastName;
            },
            message: '{VALUE} Invalid last name'
        }
    },

    email: {
        type: String,
        required: [true, 'Email embedded is required'],
        validate: {
            validator: function(email) {
                return new RegExp('^[a-z]{2,}\\.([a-z]){2,}@embedded?.ufcg?.edu?.br$').test(email);
            },
            message: '{VALUE} Invalid Email Embedded'
        }
    },

    personalEmail: {
        type: String,
        require: [true, 'Personal Email is required'],
        validate: {
            validator: function(personalEmail) {
                return new RegExp('^([_a-zA-Z0-9-]+(\\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{1,6}))?$').test(personalEmail)
            },
            message: '{VALUE} Invalid phone'
        }
    },

    phone: {
        type: String,
        required: [true, 'Phone is required'],
        validate: {
            validator: function(phone) {
                return new RegExp(/^\(?([0-9]{2})\)[0-9]{1}[ ]?([0-9]{4})\-([0-9]{4})$/).test(phone);
            },
            message: '{VALUE} Invalid phone'
        }
    },

    secondPhone: {
        type: String,
        require: false,
        validate: {
            validator: function(secondPhone) {
                if(secondPhone !== null){
                    return new RegExp(/^\(?([0-9]{2})\)[0-9]{1}[ ]?([0-9]{4})\-([0-9]{4})$/).test(secondPhone);
                }
                return true;
            },
            message: '{VALUE} Invalid phone'
        }
    },

    contrato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },

    startDate: {
        type: Date,
        required: [true, 'Activity start date is required'],
        default: Date.now(),
        validate: {
            validator: function (startDate) {
                var minDate = new Date(2005, 12, 1);
                var maxDate = new Date(2100, 12, 1);
                return startDate > minDate && startDate < maxDate;
            },
            message: '{VALUE} Invalid date'
        }
    },

    created: {
        type: Date,
        default: Date.now
    },

    favoriteStudents: {
        type:[String]
    }
}));

module.exports = mongoose.model('coach');
