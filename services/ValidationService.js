const _ = require('underscore');

exports.fieldsAreValid = function (payload) {
	for (var key of Object.keys(payload)) {
		if (_.isNull(payload[key]) || _.isUndefined(payload[key])) {
			return false;
		}
	}
	return true;	
};