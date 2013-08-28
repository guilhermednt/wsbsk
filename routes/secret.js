var db = require('../models/db');
var mongoose = require('mongoose');
var Secret = mongoose.model('Secret');

/*
 * POST a secret
 */

exports.postSecret = function(req, res) {
	var secret = new Secret({ secret: req.param('secret'), shares: { max: 2 } });
	secret.save(function(error, secret){
		if (error) errors.error(req, res, error);
		else {
			Secret.randomUnshared(secret._id, function(error, random){
				if (error) res.status(500);
				else {
					if (random !== null) {
						random.shares.current += 1;
						random.save(function(error, random){
							req.session.secret = random;
							done.done(req, res);
						});
					} else {
						res.redirect('/');
					}
				}
			});
		}
	});
};
