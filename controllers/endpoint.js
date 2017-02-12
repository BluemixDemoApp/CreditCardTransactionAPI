"use strict";

const UserService = require('../services/UserService');
const TransactionService = require('../services/TransactionService');

// Endpoints

exports.createUser = function(req, res) {

	const payload = {
		name: req.body.name,
		phone: req.body.phone,
		lat: req.body.lat,
		long: req.body.long
	};

	UserService.create(payload).then(function(ret) {
		return res.send(ret);
	}).catch(function(err) {
		return res.send(err);
	});
};

exports.createTransaction = function(req, res) {

	const payload = {
		userId: req.body.userId,
		lat: req.body.lat,
		long: req.body.long,
		address: req.body.address
	};

	TransactionService.create(payload).then(function(ret) {
		return res.send(ret);
	}).catch(function(err) {
		return res.send(err);
	});
};

exports.checkTransaction = function(req, res) {

	const payload = {
		transactionId: req.params.transactionId
	};

	TransactionService.get(payload).then(function(ret) {
		return res.send(ret);
	}).catch(function(err) {
		return res.send(err);
	});
};

exports.getTransactions = function(req, res) {

	const payload = {
		userId: req.params.userId
	};

	TransactionService.getAll(payload).then(function(ret) {
		return res.send(ret);
	}).catch(function(err) {
		return res.send(err);
	});
};