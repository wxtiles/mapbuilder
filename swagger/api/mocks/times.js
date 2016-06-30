'use strict';

module.exports = {
	get: get
};

function get(req, res, next) {
	console.log("sdjhfksd");
	res.json(["2015-01-01"]);
}