const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const Q = require('q');

exports.getByPhone = function(payload) {

	var deferred = Q.defer();

	const user = {
		tag: 'User',
		phone: payload.phone
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

exports.create = function(payload) {

	var deferred = Q.defer();

	const user = {
		tag: 'User',
		name: payload.name,
		phone: payload.phone,
		lat: payload.lat,
		long: payload.long
	};

	if (!ValidationService.fieldsAreValid(user)) {
		deferred.reject({
			error: "Supply a valid name, phone, latitude and longitude"
		});
		return deferred.promise;
	}

	cloudantDB.insert(user).then(function(user) {
		deferred.resolve({
			userId: user.id
		});
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};