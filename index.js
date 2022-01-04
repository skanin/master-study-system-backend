const express = require('express')
const app = express()
const cors = require('cors');

const bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

const port = process.env.PORT || 3001

const pretestRoutes = require('./routes/pretest');
const loginRoutes = require('./routes/login');

const fs = require('fs/promises');

const readUserNames = async () => {
    return fs.readFile('./usernames.txt', 'utf8' , (err, data) => {
        // data = data.split('\n');
        return data;
    });
}

app.use(express.json());

app.use(async (req, res, next) => {
    const req2 = req;
    if(req.url.includes('login')) {
        console.log('IN NEXT')
        next();
        return;
    }

    let usernames;
    await readUserNames().then(data => {
        usernames = data;
    });
    
    
    const username = req.data['username'];

    if(!(body.username in usernames)) {
        res.status(400).send('Invalid username');
        return;
    }

    next();
})

app.use('/login', loginRoutes);

app.use('/pretest', pretestRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
