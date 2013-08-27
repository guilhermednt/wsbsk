/*
 * GET done
 */

exports.secret = function(req, res) {
	res.render('done', { title: 'DONE!' });
};
