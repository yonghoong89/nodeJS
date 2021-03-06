var http = require('http');
var fs = require('fs');//파일 시스템모듈
//https://opentutorials.org/module/938/7373 
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
//module
var template = require('./lib/template.js');



 // request : 요청할떄 웹브라우저에 보내는것  ,response : 응답할때 웹브라우저에 전송할때
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname==='/'){
        if(queryData.id === undefined){
            
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, node.js';
                var list = template.list(filelist)
                var html = template.html(title, list, `<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);

                response.writeHead(200);
                response.end(html);//읽어야 하는 파일을 결정함
            });
            
        }else{
            fs.readdir('./data', function(error, filelist){
                var list = template.list(filelist)
                var filtereadId = path.parse(queryData.id).base;
                fs.readFile(`data/${filtereadId}`,'utf8', function(err, description){
                    var title = queryData.id;
                    var sanitizeTitle = sanitizeHtml(title);
                    var sanitizeDescription = sanitizeHtml(description, {
                        allowedTags:['h1']
                    });
                    var html = template.html(sanitizeTitle, list, `<h2>${sanitizeTitle}</h2><p>${sanitizeDescription}</p>`,
                    `
                    <a href="/create">create</a>
                    <a href="/update?id=${sanitizeTitle}">Update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizeTitle}">
                        <input type="submit" value="delete">
                    </form>
                    `
                    );
                    response.writeHead(200);
                    response.end(html);//읽어야 하는 파일을 결정함
                });
            });
        }
    }else if(pathname === "/create"){
        fs.readdir('./data', function(error, filelist){
            var title = 'WEB - create';
            var list = template.list(filelist)
            var html = template.html(title, list, `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `,'');
            response.writeHead(200);
            response.end(html);//읽어야 하는 파일을 결정함
        });
    }else if(pathname === "/create_process"){
        var body = '';
        request.on('data', function(data){//각각 데이터가 전송될때 function(data)를 콜백하게 되어있다.
           body = body + data;
        });
        request.on('end', function(){//정보수신이 끝난경우 function() 콜백 
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if(pathname === '/update'){
        fs.readdir('./data', function(error, filelist){
            var filtereadId = path.parse(queryData.id).base;
          fs.readFile(`data/${filtereadId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.html(title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}" />
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
    }else if(pathname==='/update_process'){
        var body = '';
        request.on('data', function(data){//각각 데이터가 전송될때 function(data)를 콜백하게 되어있다.
           body = body + data;
        });
        request.on('end', function(){//정보수신이 끝난경우 function() 콜백 
            var post = qs.parse(body);
            var  id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`,`data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    }else if(pathname==='/delete_process'){
        var body = '';
        request.on('data', function(data){//각각 데이터가 전송될때 function(data)를 콜백하게 되어있다.
           body = body + data;
        });
        request.on('end', function(){//정보수신이 끝난경우 function() 콜백 
            var post = qs.parse(body);
            var id = post.id;
            var filtereadId = path.parse(id).base;
            fs.unlink(`data/${filtereadId}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });
    }else{
        response.writeHead(404);
        response.end('Not found');
    }
 
});
app.listen(3000);
