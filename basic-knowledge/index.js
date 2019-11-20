// console.log(process.env);
// const mod1 = require('./mod');
let http = require('http');
let fs = require('fs');
let url = require('url');

// console.log(mod1.a);
// console.log(mod1.b);
// console.log(mod1.c);

http.createServer((req, res) => {
    // console.log('Server start...');
    // console.log(req.url);
    // console.log(url.parse(req.url));
    // let { pathname, query } = url.parse(req.url, true)
    // console.log(pathname, query);
    let result = [];
    req.on('data', buffer => {
        result.push(buffer);
    })
    req.on('end', () => {
        // console.log(result);
        let data = Buffer.concat(result);
        console.log(data.toString());
    })
    res.end();
}).listen(8888)
