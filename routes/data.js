const express = require('express');
const router = express.Router();

const readCsvHeaders = require('../helpers').readCsvHeaders;
const readCsv = require('../helpers').readCsv;

router.get('/:id', async (req, res) => {
	if (!req.params.id) {
		res.status(404).send({});
		return;
	}

	const data = await readCsv('data/Task' + req.params.id + '_coords.csv');

	res.status(200).send(data);
});

module.exports = router;
