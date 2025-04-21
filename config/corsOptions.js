
//third-party middleware -- Cross Origin Resource Sharing
const whitelist = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'];
const corseOptions = {
    origin: (origin, callback)=> {
        if(whitelist.indexOf(origin) != -1 || !origin){ //we need to remove !origin after the end of development
            callback(null, true)
        }else{
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = 