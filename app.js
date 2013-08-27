
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var done = require('./routes/done');
var http = require('http');
var path = require('path');
//var SecretProvider = require('./secretprovider').SecretProvider;
var db = require('./models/db');
var mongoose = require('mongoose');
var secretsdata = require('./models/secrets');

var Secret = mongoose.model('Secret');

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

//var secretProvider = new SecretProvider('localhost', 27017);

app.get('/', function(req, res){
	res.render('index', {title: 'The World\'s Second Best Secret Keeper'});
});
//app.get('/users', user.list);

app.post('/secret', function(req, res){
	var secret = new Secret({ secret: req.param('secret'), shares: { max: 2 } });
	secret.save(function(error, secret){
		if (error) res.status(500);
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
	/*secretProvider.save({
		secret: req.param('secret')
	}, function(error, secrets) {
		secretProvider.findRandom(secrets[0]._id, function(error, secret) {
			req.session.secret = secret;
			done.done(req, res);
		});
	});
	*/
});
app.get('/done', function(req, res){
	res.render('done', {title: 'The World\'s Second Best Secret Keeper'});
});

app.get('/list', function(req, res){
	secretsdata.secretslist(function(error, secretslist){
		res.render('list', {
			title: 'All Secrets',
			secrets: secretslist
		});
	});
	/*
	secretProvider.findAll(function(error, secrets){
		res.render('list', {
			title: 'All Secrets',
			"secrets": secrets
		});
	});
	*/
});

app.get('/random', function(req, res){
	Secret.randomUnshared(null, function(error, random){
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
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
