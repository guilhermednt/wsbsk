var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

SecretProvider = function(host, port) {
	this.db = new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
};

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

SecretProvider.prototype.getCollection = function(callback) {
	this.db.collection('secrets', function(error, secret_collection) {
		if (error) callback(error);
		else callback(null, secret_collection);
	});
};

SecretProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) callback(error);
		else {
			secret_collection.find().toArray(function(error, results) {
				if (error) callback(error);
				else callback(null, results);
			});
		}
	});
};

SecretProvider.prototype.findById = function(id, callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) callback(error);
		else {
			secret_collection.findOne({_id: secret_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
				if (error) callback(error);
				else callback(null, result);
			});
		}
	});
};

SecretProvider.prototype.findRandom = function(exclude, callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) callback(error);
		else {
			secret_collection.findOne({
				_id: {$ne:  exclude},
				shared: false
			}, function(error, result) {
				if (error) callback(error);
				else callback(null, result);
			});
		}
	});
};

SecretProvider.prototype.save = function(secrets, callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) callback(error);
		else {
			if (typeof(secrets.length == "undefined"))
				secrets = [secrets];

			for (var i = 0; i < secrets.length; i++) {
				secret = secrets[i];
				secret.created_at = new Date();
				secret.shared = false;

				if (secret.random === undefined) {
					secret.random = getRandomInt(0, 9999999999);
				}

				secret_collection.insert(secret, function() {
					callback(null, secrets);
				});
			}
		}
	});
};

exports.SecretProvider = SecretProvider;
