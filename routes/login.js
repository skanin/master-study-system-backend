const express = require('express');
const router = express.Router();
const path = require('path');

router.post('/', (req, res) => {
    
    res.send('Hello from login');
})


module.exports = router;