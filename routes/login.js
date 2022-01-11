const express = require('express');
const router = express.Router();

const readUserNames = require('../helpers').readUserNames;

router.get('/', async (req, res) => {
    let username = req.query['username'];
    if (!username) {
        res.status(400).send('Invalid username');
        return;
    }

    let usernames;

    await readUserNames().then(data => {
        usernames = data;
    });

    if (!(username in usernames)) {
        res.status(403).send('Unauthorized');
        return;
    }

    res.status(200);
})

router.post('/', async (req, res) => {
    let username = req.body['username'];
    
    let usernames;

    await readUserNames().then(data => {
        usernames = data.split('\n');
    });

    if (!username || !(usernames.includes(username))) {
        res.status(403).send('Invalid username');
        return;
    }

    res.status(200).send({helpType: Math.floor(Math.random() * 3) + 1, subject: 1});
})


module.exports = router;