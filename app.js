
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var SecretProvider = require('./secretprovider').SecretProvider;

var app = express();

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

var secretProvider = new SecretProvider('localhost', 27017);
//var secretProvider = new SecretProvider();

app.get('/', function(req, res){
	res.render('index', {title: 'The World\'s Second Best Secret Keeper'});
});
//app.get('/users', user.list);

app.post('/secret', function(req, res){
	secretProvider.save({
		secret: req.param('secret')
	}, function(error, secrets) {
		res.redirect('/done');
	});
});
app.get('/done', function(req, res){
	res.render('done', {title: 'The World\'s Second Best Secret Keeper'});
});

app.get('/list', function(req, res){
	secretProvider.findAll(function(error, secrets){
		res.render('list', {
			title: 'All Secrets',
			"secrets": secrets
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
