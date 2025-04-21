const path = require('path');
const express = require ('express');
const app = express();
const cors = require('cors');
const corseOptions = require('./config/corsOptions');


const {logger} = require('./middleware/logEvents');
const {errorHandler} = require('./middleware/errorHandler');

//define a port for the web server
const PORT = process.env.PORT || 3500;

//custom middleware logger from the logEvent.js
app.use(logger);

//to test we open dev tools in the website we want as www.google.com and type ==> fetch('http://localhost:3500');
//we put our project and it mainly frontend project react or even vanilla JS domain to the whitelist to ba able to access the routes
app.use(cors(corseOptions));


//built-in middleware to handle urlencoded form data
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); // parse URL-encoded data with querystring library

//built-in middleware for json
app.use(express.json());

//built-in middleware to serve the static files
app.use('/',express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));


//app.use(/\//) ==> for middleware
//app.all() ==> for all routes (accept RegEx)
app.all(/.*/, (req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views','404.html'));
    }
    else if(req.accepts('json')){
        res.json({error: '404 Not Found'});
    }
    else{
        res.type('txt').send('404 Not Found');
    }
    
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

