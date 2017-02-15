"use strict";

const UserService = require('../services/UserService');
const TransactionService = require('../services/TransactionService');
const env = process.env;

// Endpoints

exports.getSMS = function(req, res) {

	console.log("Twilio Webhook: ", req.query);

	// Phone number used to dispatch the message
	const twilioPhoneNumber = '+1' + env.twilio_phone_number;

	if (req.query.From === twilioPhoneNumber) {
		return res.sendStatus(200);
	}

	const message = req.query.Body ? req.query.Body : null;

	const payload = {
		phone: req.query.From ? req.query.From.replace('+1', '') : null,
		message: message
	};

	TransactionService.unlock(payload).then(function() {
		res.sendStatus(200);
	});
};

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

exports.getUsers = function(req, res) {

	UserService.getAll().then(function(ret) {
		return res.send(ret);
	}).catch(function(err) {
		return res.send(err);
	})
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