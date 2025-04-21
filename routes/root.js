const express  =require('express');
const router = express.Router();
const path = require('path');

// respond with a file when a GET request is made to the /index path
router.get(/^\/$|\/index(\.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..' ,'views', 'index.html'));
    console.log('Sending:', path.join(__dirname, 'views', 'index.html'));
});


module.exports = router;