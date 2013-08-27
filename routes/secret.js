
/*
 * POST a secret
 */
var Util = require('./util').Util;

exports.secret = function(req, res) {
	secretProvider.save({
		secret: req.param('secret'),
		created_at: new Date(),
		random: Util.getRandomInt(0, 9999999999)
	}, function(error, docs) {
		res.redirect('/done');
	});
};
