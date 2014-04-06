//web.js

var port = Number(process.env.PORT || 5000);

var express = require('express'),
app = express();


app.configure(function(){
    app.use('bower_components', express.static(__dirname+'/bower_components'));
    app.use('fonts', express.static(__dirname+'/fonts'));
    app.use('images', express.static(__dirname+'/images'));
    app.use('views', express.static(__dirname+'/views'));
    app.use('styles', express.static(__dirname+'/stles'));
    app.use('scripts', express.static(__dirname+'/scripts'));
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
app.listen(port);

