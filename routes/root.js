const express  =require('express');
const router = express.Router();
const path = require('path');

// respond with a file when a GET request is made to the /index path
router.get(/^\/$|\/index(\.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..' ,'views', 'index.html'));
    console.log('Sending:', path.join(__dirname, 'views', 'index.html'));
});
// router.get('/index.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
//     console.log('Sending:', path.join(__dirname, 'views', 'index.html'));
// });

// respond with a file when a GET request is made to the /new-page path
router.get(/\/new-page(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..' , 'views', 'new-page.html'));
});

// redirect with a GET request
router.get(/\/old-page(.html)?/, (req, res) => {
    res.redirect(301, '/new-page.html'); //response code will be 302 by default but we want is 301 which is permentantly move
});

module.exports = router;