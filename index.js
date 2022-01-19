const readUserNames = require('./helpers.js').readUserNames;

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

app.use(express.json());

app.use(async (req, res, next) => {
	console.log(`${req.method.toUpperCase()}: ${req.path}`);

	const username = req.method === 'POST' ? req.body['username'] : req.query['username'];

	console.log(`Data: ${username}`);

	if (req.url.includes('login')) {
		next();
		return;
	}

	let usernames;
	await readUserNames().then((data) => {
		usernames = data;
	});

	if (!username || !usernames.includes(username)) {
		res.status(403).send('Invalid username');
		return;
	}

	next();
	return;
});

app.use('/auth', authRoutes);

app.use('/login', loginRoutes);

app.use('/pretest', pretestRoutes);

app.use('/study', studyRoutes);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
