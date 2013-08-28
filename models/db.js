var mongoose = require('mongoose');
var id = new mongoose.Types.ObjectId;

var secretSchema = new mongoose.Schema({
	secret: String,
	shares: {
		max: { type: Number, default: 1 },
		current: { type: Number, default: 0 }
	},
	created_at: { type: Date, default: Date.now }
});

secretSchema.statics.randomUnshared = function(exclude, callback) {
	this.$where('this.shares.current < this.shares.max').find({_id: { $ne: exclude}}).count(function(err, count) {
		if (err) {
			console.log(err);
			return callback(err);
		}
		if (count > 0) {
			var rand = Math.floor(Math.random() * count);
			console.log("Count: " + count);
			this.$where('this.shares.current < this.shares.max').findOne().skip(rand).exec(callback);
		} else {
			return callback(null, null);
		}
	}.bind(this));
};
secretSchema.statics.shareRandom = function(exclude, callback) {
	this.randomUnshared(exclude, function(error, random){
		if (error) callback(error);
		else {
			if (random !== null) {
				random.shares.current += 1;
				random.save(function(error, random){
					callback(null, random);
				});
			} else {
				callback(null, null);
			}
		}
	});
};

var Secret = mongoose.model('Secret', secretSchema);

var keySchema = new mongoose.Schema({
	key: String,
	secret: {type: mongoose.Schema.ObjectId, ref: 'secretSchema'},
	used: {type: Boolean, default: false}
});

keySchema.statics.shareSecret = function(key, callback) {
	this.findOne({key: key, used: false}, function(error, uKey){
		if (error) callback(error);
		else {
			if (uKey === null) {
				return callback({status: 403, message: 'Invalid key'});
			}
			uKey.used = true;
			uKey.save(function(error, uKey){
				Secret.shareRandom(uKey.secret, callback);
			});
		}
	});
};
var Key = mongoose.model('Key', keySchema);

mongoose.connect( 'mongodb://localhost/secrets' );
