const cloudantDB = require('./CloudantService').dbConnection;
const ValidationService = require('./ValidationService');
const UserService = require('./UserService');
const TwilioService = require('./TwilioService');

const Q = require('q');
const _ = require('underscore');

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

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

	UserService.get({
		userId: transaction.userId
	}).then(function(user) {
		if (!_.isNull(user)) {

			let status = 'OK';
			const maxDistance = 1000; // Kilometers
			const distanceBetweenPoints = calculateDistance(transaction.lat, transaction.long, user.lat, user.long, 'K');

			const insertTransaction = function(transaction, status) {
				cloudantDB.insert(transaction).then(function(transaction) {
					deferred.resolve({
						transactionId: transaction.id,
						status: status
					});
				}).catch(function(err) {
					deferred.reject(err);
				});
			};

			// 1000 Kilometers
			if (distanceBetweenPoints >= maxDistance) {
				status = 'ALERT';
				TwilioService.sendMessage(user.phone, "THIS IS A TEST MESSAGE").then(function() {
					insertTransaction(transaction, status);
				}).catch(function(err) {
					deferred.reject({
						error: 'Could not send Twilio SMS message: ' + err
					});
				});
			} else {
				insertTransaction(transaction, status);
			}

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
			deferred.resolve(transaction.docs.map(function(doc) {
				doc.id = doc._id;
				return doc;
			})[0]);
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

	if (!ValidationService.fieldsAreValid(transaction)) {
		deferred.reject({
			error: "Supply a valid transaction id"
		});
		return deferred.promise;
	}

	cloudantDB.find({
		selector: transaction
	}).then(function(transactions) {
		deferred.resolve(transactions.docs.map(function(doc) {
			doc.id = doc._id;
			return doc;
		}));
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};