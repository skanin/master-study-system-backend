const readUserNames = require('./helpers.js').readUserNames;
const getFilteredUsernames = require('./helpers.js').getFilteredUsernames;

const express = require('express');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

const pretestRoutes = require('./routes/pretest');
const loginRoutes = require('./routes/login');
const authRoutes = require('./routes/auth');
const studyRoutes = require('./routes/study');
const dataRoutes = require('./routes/data');
const logRoutes = require('./routes/logs');

app.use(express.json());

app.use(async (req, res, next) => {
	console.log(`${req.method.toUpperCase()}: ${req.path}`);

	const username = req.method === 'POST' ? req.body['username'] : req.query['username'];

	console.log(`Data: ${username}`);

	if (req.url.includes('login') || req.url.includes('data')) {
		next();
		return;
	}

	if (!username) {
		res.status(400).send('Invalid username');
		return;
	}

	const filteredUsernames = await getFilteredUsernames(username);

	if (!filteredUsernames.length) {
		res.status(403).send('Unauthorized');
		return;
	}

	next();
	return;
});

app.use('/auth', authRoutes);

app.use('/login', loginRoutes);

app.use('/pretest', pretestRoutes);

app.use('/study', studyRoutes);

app.use('/data', dataRoutes);

app.use('/logs', logRoutes);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
