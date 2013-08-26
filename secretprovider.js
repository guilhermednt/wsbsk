var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

SecretProvider = function(host, port) {
	this.db = new Db('node-mongo-secret', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
};

SecretProvider.prototype.getCollection = function(callback) {
	this.db.collection('secrets', function(error, secret_collection) {
		if (error)
			callback(error);
		else
			callback(null, secret_collection);
	});
};

SecretProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) {
			callback(error);
		} else {
			secret_collection.find().toArray(function(error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

SecretProvider.prototype.save = function(secrets, callback) {
	this.getCollection(function(error, secret_collection) {
		if (error) {
			callback(error);
		} else {
			if (typeof(secrets.length) == "undefined") {
				secrets = [secrets];
			}

			for (var i = 0; i < secrets.length; i++) {
				secret = secrets[i];
				secret.created_at = new Date();
			}

			secret_collection.insert(secrets, function() {
				callback(null, secrets);
			});
		}
	});
};

exports.SecretProvider = SecretProvider;
