const express = require('express');
const router = express.Router();

const readUserNames = require('../helpers.js').readUserNames;

router.post('/isAuthenticated', async (req, res) => {
	let username = req.body['username'];

	let usernames;

	await readUserNames().then((data) => {
		usernames = data.split('\n');
	});

	if (!username || !usernames.includes(username)) {
		res.status(403).send(false);
		return;
	}

	res.status(200).send(true);
});

module.exports = router;
