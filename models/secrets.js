var mongoose = require('mongoose');

exports.secretslist = function(callback){
	var Secret = mongoose.model('Secret');
	Secret.find({}, function (err, secrets) {
		if(err){
			console.log(err);
		} else {
			console.log(secrets);
			callback(null, secrets);
		}
	});
};
