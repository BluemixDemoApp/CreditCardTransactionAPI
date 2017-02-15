const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const Q = require('q');

exports.getByPhone = function(payload) {

	var deferred = Q.defer();

	const user = {
		tag: 'User',
		phone: Number(payload.phone)
	};

	cloudantDB.find({
		selector: user
	}).then(function(user) {
		if (user.docs && user.docs.length === 1) {
			deferred.resolve(user.docs.map(function(user){
				user.id = user._id;
				return user;
			})[0]);
		} else {
			deferred.resolve(null);
		}
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

exports.getById = function(payload) {

	var deferred = Q.defer();

	const user = {
		tag: 'User',
		_id: payload.userId
	};

	cloudantDB.find({
		selector: user
	}).then(function(user) {
		if (user.docs && user.docs.length === 1) {
			deferred.resolve(user.docs.map(function(user){
				user.id = user._id;
				return user;
			})[0]);
		} else {
			deferred.resolve(null);
		}
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

/* Fetch all users */
exports.getAll = function() {

	var deferred = Q.defer();

	const users = {
		tag: 'User'
	};

	cloudantDB.find({
		selector: users
	}).then(function(users) {
		deferred.resolve(users.docs.map(function(doc) {
			doc.id = doc._id;
			return doc;
		}));
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

exports.create = function(payload) {

	var deferred = Q.defer();

	const user = {
		tag: 'User',
		name: payload.name,
		phone: Number(payload.phone),
		lat: payload.lat,
		long: payload.long
	};

	if (!ValidationService.fieldsAreValid(user)) {
		deferred.reject({
			error: "Supply a valid name, phone, latitude and longitude"
		});
		return deferred.promise;
	}

	exports.getByPhone({
		phone: Number(user.phone)
	}).then(function(ret) {
		if (ret === null) {
			cloudantDB.insert(user).then(function(user) {
				deferred.resolve({
					userId: user.id
				});
			}).catch(function(err) {
				deferred.reject(err);
			});
		} else {
			deferred.reject({
				error: "Phone already in use!"
			});
		}
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};