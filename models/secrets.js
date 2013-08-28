var mongoose = require('mongoose');

exports.secretslist = function(callback){
	var Secret = mongoose.model('Secret');
	Secret.find({}, function (err, secrets) {
		if(err){
			callback(err);
		} else {
			callback(null, secrets);
		}
	});
};
