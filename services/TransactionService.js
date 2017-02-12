const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const Q = require('q');

exports.create = function(payload) {

	var deferred = Q.defer();

	const transaction = {
		tag: 'Transaction',
		userId: payload.userId,
		lat: payload.lat,
		long: payload.long,
		address: payload.address
	};

	if (!ValidationService.fieldsAreValid(transaction)) {
		deferred.reject({
			error: "Supply a valid latitude, longitude and address"
		});
		return deferred.promise;
	}

	cloudantDB.insert(transaction).then(function(transaction) {
		deferred.resolve({
			transactionId: transaction.id,
			status: "OK"
		});
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

/* Fetch a single transaction based on transactionId */
exports.get = function(payload) {

	var deferred = Q.defer();

	const transaction = {
		tag: 'Transaction',
		id: payload.transactionId
	};

	if (!ValidationService.fieldsAreValid(transaction)) {
		deferred.reject({
			error: "Supply a valid transaction id"
		});
		return deferred.promise;
	}

	cloudantDB.get(transaction).then(function(transaction) {
		deferred.resolve({
			id: transaction.id,
			status: transaction.status
		});
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

/* Fetch all transactions based on userId */
exports.getAll = function(payload) {

	var deferred = Q.defer();

	const transaction = {
		tag: 'Transaction',
		userId: payload.userId
	};

	console.log(transaction);

	if (!ValidationService.fieldsAreValid(transaction)) {
		deferred.reject({
			error: "Supply a valid transaction id"
		});
		return deferred.promise;
	}

	cloudantDB.get(transaction).then(function(transactions) {
		deferred.resolve(transactions);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};