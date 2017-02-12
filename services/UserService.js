const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const Q = require('q');

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