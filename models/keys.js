var mongoose = require('mongoose');

exports.keyslist = function(callback){
	var Key = mongoose.model('Key');
	Key.find({}, function (err, keys) {
		if(err){
			console.log(err);
		} else {
			console.log(keys);
			callback(null, keys);
		}
	});
};
