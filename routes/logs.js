const express = require('express');
const router = express.Router();

const fs = require('fs');

const writeToCsv = require('../helpers').writeToCsv;
const readCsvHeaders = require('../helpers').readCsvHeaders;

router.post('/', async (req, res) => {
	let headers = [];
	const subject = { id: req.body.subject, username: req.body.username };

	const path = process.cwd() + `/data/logs${subject.id}${subject.username}.csv`;

	await readCsvHeaders(path)
		.then((header) => {
			headers = header;
		})
		.catch((err) => {
			console.log('No file found, creating new.');
		});

	let tmp = [];
	for (let log of req.body.logs) {
		let data = {};
		console.log(log);
		for (let logEntry of Object.entries(log)) {
			let [key, value] = logEntry;
			data[key] = value;
		}
		tmp.push(data);
	}
	console.log(tmp);
	writeToCsv(path, tmp, fs.existsSync(path));

	res.sendStatus(200);
});

module.exports = router;
