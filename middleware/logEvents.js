const {format} = require('date-fns');
const {v4 : uuid} = require('uuid');

const fs = require('fs');
const fsPromises = require ('fs').promises;
const path = require ('path');

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    console.log(logItem); // Log to console
    try{
        if(!fs.existsSync(path.join(__dirname, '..' , 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..' , 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..' ,'logs', 'reqLog.txt'), logItem);
        
    }catch(err){
        console.error(err);
    }
}

//custom middleware to export
const logger = (req,res,next)=> {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = {logger, logEvents};
// This module exports a function that logs events to a file and the console.