const express = require('express');
const router = express.Router();

const readUserNames = require('../helpers.js').readUserNames;
const getFilteredUsernames = require('../helpers.js').getFilteredUsernames;

router.post('/isAuthenticated', async (req, res) => {
	let username = req.body['username'];

	if (!username) {
		res.status(400).send('Invalid username');
		return;
	}

	username = username.toLowerCase();

	const filteredUsernames = await getFilteredUsernames(username);

	if (!filteredUsernames.length) {
		res.status(403).send('Unauthorized');
		return;
	}

	res.status(200).send(true);
});

module.exports = router;
