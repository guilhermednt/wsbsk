
/*
 * Erros
 */

exports.error = function(req, res, error){
	console.log(error);
	if (error.status > 0) {
		res.status(error.status);
	} else {
		res.status(500);
	}
	var message = "An error occurred. :(";
	if (typeof(error.message) === "string") {
		message = error.message;
	}
	res.render('error', { title: 'ERROR', message: message });
};