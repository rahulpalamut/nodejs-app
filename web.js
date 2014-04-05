//web.js
// var express = require("express");
// var logfmt = require("logfmt");
// var app = express();

// app.use(logfmt.requestLogger());

// app.get('/', function(req, res) {

//   window.open(index.html);
// });

// var port = Number(process.env.PORT || 5000);
// app.listen(port, function() {

//    console.log("Listening on " + port);
// });

var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    index;
 
fs.readFile('./index.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});
 
http.createServer(function(request, response) {
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(index);
    response.close();
}).listen(8000);
