'use strict';

module.exports = {
	get: get
};

function get(req, res, next) {
	console.log("sdjhfksd");
	res.sendFile("tile.png", {"root": __dirname})
	//res.json([{ user: 'mock', created: new Date(), text: 'this' }]);
}