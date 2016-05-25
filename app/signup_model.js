var mongoose = require('mongoose');
var Indicative = require('indicative');
var signupSchema = mongoose.Schema({
    email: {
    	type: String,
    	required: true
    },
    timestamp: {
   		type: Date,
   		default: Date.now
    },
    comments: String
});

var validator = {
  email: 'required|email'
}

module.exports = mongoose.model('Signup', signupSchema);

module.exports.validate = function(data){
	return Indicative.validateAll(data, validator);
}