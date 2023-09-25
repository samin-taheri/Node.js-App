// const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const fsPromises = require('fs').promises;

// const logEvents= require('./logEvent');
// const EventEmitter = require('events');
// class Emitter extends EventEmitter {};
// const myEmitter = new Emitter();
const {logger} = require('./middleware/logEvent')
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;


app.use(logger);
// custom middleware logger
//app.use(logger);

// Cross Origin Resource Sharing
// const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World!');
});


// chaining route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// const serveFile = async (filePath, contentType, response) => {
//     try {
//         const rawData = await fsPromises.readFile(
//             filePath,
//             !contentType.includes('image') ? 'utf8' : ''
//         );
//         const data = contentType === 'application/json'
//             ? JSON.parse(rawData) : rawData;
//         response.writeHead(
//             filePath.includes('404.html') ? 404 : 200,
//             { 'Content-Type': contentType }
//         );
//         response.end(
//             contentType === 'application/json' ? JSON.stringify(data) : data
//         );
//     } catch (err) {
//         console.log(err);
//         myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
//         response.statusCode = 500;
//         response.end();
//     }
// }
// const server = http.createServer((req, res)=> {
//     console.log(req.url, req.method);
//     myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt');

//     const extension = path.extname(req.url);

//     let contentType;

//     switch (extension) {
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.jpg':
//             contentType = 'image/jpeg';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.txt':
//             contentType = 'text/plain';
//             break;
//         default:
//             contentType = 'text/html';
//     }

// let filePath =
//         contentType === 'text/html' && req.url === '/'
//             ? path.join(__dirname, 'views', 'index.html')
//             : contentType === 'text/html' && req.url.slice(-1) === '/'
//                 ? path.join(__dirname, 'views', req.url, 'index.html')
//                 : contentType === 'text/html'
//                     ? path.join(__dirname, 'views', req.url)
//                     : path.join(__dirname, req.url);

//     // makes .html extension not required in the browser
//     if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

//     const fileExists = fs.existsSync(filePath);

//     if (fileExists) {
//         serveFile(filePath, contentType, res);
//     } else {
//         switch (path.parse(filePath).base) {
//             case 'old-page.html':
//                 res.writeHead(301, { 'Location': '/new-page.html' });
//                 res.end();
//                 break;
//             case 'www-page.html':
//                 res.writeHead(301, { 'Location': '/' });
//                 res.end();
//                 break;
//             default:
//                 serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
//         }
//     }
// });


// myEmitter.on('log', (msg)=> logEvents(msg));
