
/*
 * GET done
 */

exports.done = function(req, res) {
	res.render('done', { title: 'DONE!', secret: req.session.secret });
};
