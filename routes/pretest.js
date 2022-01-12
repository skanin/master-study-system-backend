const express = require('express');
const router = express.Router();

const fs = require('fs');

const writeToCsv = require('../helpers').writeToCsv;
const readCsvHeaders = require('../helpers').readCsvHeaders;

router.post('/', async (req, res) => {
	let headers = [];
	const path = process.cwd() + '/data/pretestAnswers.csv';

	await readCsvHeaders(path)
		.then((header) => {
			headers = header;
		})
		.catch((err) => {
			console.log(err);
		});

	let data = { subjectId: req.body.subject, username: req.body.username };
	console.log(req.body);
	req.body.questions.forEach((element) => {
		data[`pretest.${element.questionId}`] = element.checked >= 0 ? element.checked : null;
		data[`pretest.${element.questionId}_correct`] = element.correct;
	});

	for (let header of headers) {
		if (!data.hasOwnProperty(header)) {
			data[header] = null;
		}
	}

	console.log(data);
	console.log(process.cwd());

	writeToCsv(path, data, fs.existsSync(path));

	res.sendStatus(200);
});

module.exports = router;
