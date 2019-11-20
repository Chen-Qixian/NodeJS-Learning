const http = require('http')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')

let user = {
    admin: 123456
}

http.createServer((req, res) => {
    let path, get, post;
    if (req.method == 'GET') {
        // get请求的参数写在url中需要分别解析path和参数query
        let { pathname, query } = url.parse(req.url, true);
        path = pathname;
        get = query;
        complete();
    }
    else if (req.method == 'POST') {
        let arr = [];
        // post的url中不带参数，参数在请求体中
        path = req.url;
        // post数据较大可能用到buffer多次读入
        req.on('data', buffer => {
            arr.push(buffer);
        })
        req.on('end', () => {
            post = querystring.parse(Buffer.concat(arr).toString());
            // 由于这是异步请求，因此必须在end中调用complete，否则拿不到post的数据
            complete();
        })
        
    }

    function complete() {
        if (path === '/login') {
            let { username, password } = get;
            if (!user[username]) {
                res.end(JSON.stringify({
                    err: 1,
                    msg: 'user does not exist!'
                }))
            }
            else if (user[username] != password) {
                res.end(JSON.stringify({
                    err: 1,
                    msg: 'password error!'
                }))
            }
            else {
                res.end(JSON.stringify({
                    err: 0,
                    msg: 'login succeed!'
                }))
            }
        }
        else if (path === '/reg') {
            let { username, password } = post;
            if (user[username]) {
                res.end(JSON.stringify({
                    err: 1,
                    msg: 'user already exists'
                }))
            }
            else {         
                res.end(JSON.stringify({
                    err: 0,
                    msg: 'register succeed!'
                }))
                // 注意需要将注册数据介入“数据库”
                user[username] = password;
            }
        }
        else {
            fs.readFile(`www${path}`, (err, data) => {
                if (err) {
                    res.end('404')
                }
                else {
                    res.end(data);
                }
            })
        }
    }
}).listen(8888)