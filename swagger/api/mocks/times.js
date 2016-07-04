'use strict';

module.exports = {
	get: get
};

//We need to explicitly implement a mock for this because of an issue in an older version of swagger-tools.
//Unfortunately a dependency of a dependency does not use the latest version of swagger-tools.
function get(req, res, next) {
	res.json(["2015-01-01"]);
}