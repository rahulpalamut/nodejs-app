//web.js

var port = Number(process.env.PORT || 5000);

var express = require('express'),
app = express();


app.configure(function(){
    app.use('/fonts', express.static(__dirname+'/fonts'));
    app.use('/styles', express.static(__dirname+'/styles'));
    app.use('/views', express.static(__dirname+'/views'));
    app.use('/scripts', express.static(__dirname+'/scripts'));
    app.use('/images', express.static(__dirname+'/images'));
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
app.listen(port);
