//web.js
// this works for some reason
var port = Number(process.env.PORT || 5000);

var express = require('express'),
app = express();


app.configure(function(){
    app.use('/bower_components/angular-leaflet/dist/', express.static(__dirname+'/bower_components/angular-leaflet/dist/'));
    app.use('/bower_components/angular-collection/', express.static(__dirname+'/bower_components/angular-collection'));
    app.use('/bower_components/bootstrap/dist/css/', express.static(__dirname+'/bower_components/bootstrap/dist/css/'));
 app.use('/bower_components/bootstrap/dist/fonts/', express.static(__dirname+'/bower_components/bootstrap/dist/fonts/'));
    
    
    app.use('/fonts/', express.static(__dirname+'/fonts/'));
    app.use('/images/', express.static(__dirname+'/images/'));
    app.use('/views', express.static(__dirname+'/views/'));
    app.use('/styles/', express.static(__dirname+'/styles/'));
    app.use('/scripts/', express.static(__dirname+'/scripts/'));
    app.use('/bower_components/angular/', express.static(__dirname+'/bower_components/angular/'));
    app.use('/bower_components/angular-cookies/', express.static(__dirname+'/bower_components/angular-cookies/'));
    app.use('/bower_components/angular-resource/', express.static(__dirname+'/bower_components/angular-resource/'));
    app.use('/bower_components/angular-sanitize/', express.static(__dirname+'/bower_components/angular-sanitize/'));
    app.use('/bower_components/angular-route/', express.static(__dirname+'/bower_components/angular-route/'));

});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
app.listen(port);

