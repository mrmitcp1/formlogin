let http = require('http')
let url = require('url')
let fs = require('fs')
let qs=require('qs')
let handlers={}
let login
let server = http.createServer(function (req,res) {
 let pathname = url.parse(req.url,true).pathname
    switch (pathname) {
        case '/home':
            handlers.home(req,res)
            break;
        case  '/login':
            handlers.login(req,res)
            break;
        case '/profile':
            handlers.profile(req,res)
            break;
        default:
            handlers.notfound(req,res)
            break;
    }
})
server.listen(3000,()=>{
    console.log('server running')
})
handlers.home=function (req,res) {
    fs.readFile('./views/home.html','utf-8',function (err, data) {
        res.write(data)
        res.end()
    })
}
handlers.notfound=function (req,res) {
    fs.readFile('./views/notfound.html','utf-8',function (err, data) {
        res.write(data)
        res.end()
    })
}

handlers.profile=function (req,res) {
    fs.readFile('./views/profile.html','utf-8',function (err, data) {
        data=data.replace('{name}',login.name)
        res.write(data)
        res.end()
    })
}

handlers.login=  function (req,res) {
 if (req.method==='GET'){
     fs.readFile('./views/login.html','utf-8',function (err, data) {
         res.writeHead(200,{'Content-Type':'text/html'})
         res.write(data)
         res.end()
     })
 }
 else {
     let data =''
     req.on('data',chunk=>{
         data+=chunk
     })
     req.on('end',()=>{
         login=qs.parse(data)
         fs.readFile('./views/profile.html','utf-8',function (err, datahtml) {
             res.writeHead(301,{location:'/profile'})
             res.write(datahtml)
             res.end()
         })
     })
 }
}