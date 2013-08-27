var mongoose = require('mongoose');

var secretSchema = new mongoose.Schema({
	secret: String,
	shares: {
		max: { type: Number, default: 1 },
		current: { type: Number, default: 0 }
	},
	created_at: { type: Date, default: Date.now }
});

secretSchema.statics.randomUnshared = function(exclude, callback) {
	var filter = {
		'shares.current': { $lt: 'shares.max' }
	};
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
var Secret = mongoose.model('Secret', secretSchema);

mongoose.connect( 'mongodb://localhost/secrets' );
