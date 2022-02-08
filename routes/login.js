const express = require('express');
const router = express.Router();

const readUserNames = require('../helpers').readUserNames;
const getFilteredUsernames = require('../helpers.js').getFilteredUsernames;

router.get('/', async (req, res) => {
	let username = req.query['username'];
	console.log('HEllo');
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

	res.status(200).send({});
});

// router.post('/', async (req, res) => {
// 	let username = req.body['username'];

// 	let usernames;

// 	await readUserNames().then((data) => {
// 		usernames = data.split('\n');
// 	});

// 	if (!username || !usernames.includes(username)) {
// 		res.status(403).send('Invalid username');
// 		return;
// 	}

// 	res.status(200).send({ helpType: 2, subject: 1 });
// });

router.post('/', async (req, res) => {
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

	res.status(200).send({
		helpType: parseInt(filteredUsernames[0].helpType),
		subject: filteredUsernames[0].username,
	});
});

module.exports = router;
