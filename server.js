require('dotenv').config(); //import dotenv to load environment variables from .env file
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT'); //import the verifyJWT middleware
const cookieParser = require('cookie-parser'); //import the cookie-parser middleware
const credentials = require('./middleware/credentials'); //import the credentials middleware

//Database connection
const mongoose = require('mongoose'); //import mongoose to connect to the database
const connectDB = require('./config/dbConn'); //import the connectDB function from dbConn.js

const PORT = process.env.PORT || 3500;

connectDB(); //call the connectDB function to connect to the database


// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// cookie parser middleware
app.use(cookieParser()); //use the cookie-parser middleware to parse cookies in the request

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); //use the verifyJWT middleware for all routes after this line (it is waterfall)
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => 
    {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


