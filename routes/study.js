const express = require('express');
const router = express.Router();

const fs = require('fs');

const writeToCsv = require('../helpers').writeToCsv;
const readCsvHeaders = require('../helpers').readCsvHeaders;

router.post('/', async (req, res) => {
	let headers = [];
	const path = process.cwd() + '/data/studyAnswers.csv';

	await readCsvHeaders(path)
		.then((header) => {
			headers = header;
		})
		.catch((err) => {
			console.log('No file found, creating new.');
		});

	let data = { subjectId: req.body.subject, username: req.body.username };

	for (let answer of req.body.answers) {
		let [key, value] = Object.entries(answer)[0];
		data[key] = value;
	}

	writeToCsv(path, data, fs.existsSync(path));

	res.sendStatus(200);
});

module.exports = router;
