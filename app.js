
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var index = require('./routes/index');
var done = require('./routes/done');
var errors = require('./routes/errors');
var http = require('http');
var path = require('path');
var db = require('./models/db');
var mongoose = require('mongoose');
var secretsdata = require('./models/secrets');
var keysdata = require('./models/keys');

var Secret = mongoose.model('Secret');
var Key = mongoose.model('Key');

var app = express();

app.use(express.cookieParser());
app.use(express.session({secret: 'ChangeThisSecret!'}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/secret', function(req, res){
	var secret = new Secret({ secret: req.param('secret'), shares: { max: 2 } });
	secret.save(function(error, secret){
		if (error) errors.error(req, res, error);
		else {
			require('crypto').randomBytes(48, function(ex, buf) {
				var token = buf.toString('hex');
				var key = new Key({key: token, secret: secret._id});
				key.save(function(error,key){
					if (error) errors.error(req, res, error);
					else {
						res.redirect('/random/' + key.key);
					}
				});
			});
		}
	});
});

app.get('/list', function(req, res){
	secretsdata.secretslist(function(error, secretslist){
		res.render('list', {
			title: 'All Secrets',
			secrets: secretslist
		});
	});
});

app.get('/random/:key', function(req, res){
	Key.shareSecret(req.param('key'), function(error,random){
		if (error) errors.error(req, res, error);
		else {
			if (random !== null) {
				req.session.secret = random;
				done.done(req, res);
			} else {
				res.redirect('/');
			}
		}
	});
});

app.get('/key/:secret', function(req, res){
	require('crypto').randomBytes(48, function(ex, buf) {
		var token = buf.toString('hex');
		var key = new Key({key: token, secret: req.param('secret')});
		key.save(function(error,key){
			if (error) errors.error(req, res, error);
			else {
				console.log(key);
				res.send(key);
			}
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
