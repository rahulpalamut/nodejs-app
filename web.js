//web.js

var port = Number(process.env.PORT || 5000);

var express = require('express'),
app = express();


app.configure(function(){
    app.use('/assets/css', express.static(__dirname+'/assets/css'));
    app.use('/assets/js', express.static(__dirname+'/assets/js'));
    app.use('/xassets/screenshots', express.static(__dirname+'/assets/screenshots'));
    app.use('/assets/images', express.static(__dirname+'/assets/images'));
});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
app.listen(port);
