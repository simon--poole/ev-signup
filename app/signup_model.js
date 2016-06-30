var mongoose = require('mongoose');
var Indicative = require('indicative');
var shortid = require('shortid');
var signupSchema = mongoose.Schema({
    email: {
    	type: String,
    	required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: shortid.generate()
    },
    timestamp: {
   		type: Date,
   		default: Date.now
    },
    comments: String
});

var validator = {
  email: 'required|email',
  comments: 'max:500'
}

module.exports = mongoose.model('Signup', signupSchema);

module.exports.validate = function(data){
	return Indicative.validateAll(data, validator);
}