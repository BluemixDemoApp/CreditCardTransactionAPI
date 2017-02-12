const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const UserService = require('./UserService');

const Q = require('q');
const _ = require('underscore');

exports.create = function(payload) {

	var deferred = Q.defer();

	// TODO: Validate user id before creating transaction

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

	UserService.get({
		userId: transaction.userId
	}).then(function(user) {
		if (!_.isNull(user)) {
			cloudantDB.insert(transaction).then(function(transaction) {
				deferred.resolve({
					transactionId: transaction.id,
					status: "OK"
				});
			}).catch(function(err) {
				deferred.reject(err);
			});
		} else {
			deferred.reject({
				error: 'User not found!'
			});
		}
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
		_id: payload.transactionId
	};

	if (!ValidationService.fieldsAreValid(transaction)) {
		deferred.reject({
			error: "Supply a valid transaction id"
		});
		return deferred.promise;
	}

	cloudantDB.find({
		selector: transaction
	}).then(function(transaction) {
		if (transaction.docs && transaction.docs.length === 1) {
			deferred.resolve(transaction.docs[0]);
		} else {
			deferred.resolve(null);
		}
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

	cloudantDB.find({
		selector: transaction
	}).then(function(transactions) {
		deferred.resolve(transactions.docs);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};