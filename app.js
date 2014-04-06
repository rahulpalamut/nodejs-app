//web.js
// this works for some reason
var port = Number(process.env.PORT || 5000);

var express = require('express')
var http = require('http');

app = express();

var mongoose = require('mongoose');

var accountSid = 'AC832af666a512f7edf14851909c6976f9';
var authToken = "your-auth-token";

var client = require('twilio')(accountSid, authToken);

//var http = require('http');
//var _ = require('lodash-node');

// var logfmt = require("logfmt");


var Meal = null
var uristring = 
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test';

function httpGet(theUrl, meal, dininghall)
{
    http.get(theUrl, function(res) {
  	//console.log("Got response: " + res.read());
  	var body = ''
  	res.on('data', function (chunk) {
  	    body += chunk
  	});
  	res.on('end', function() {
    	    //console.log(body);
    	    var dhinfo = JSON.parse(body)
    	    var collection = dhinfo.results.collection1
    	    for(var i = 0; i < collection.length; ++i){
		/*
      		  Meal.find({'fooditem':collection[i].Item.text}, function (err, food) {
    		  if (err) return console.error(err);
   		  console.log('I found' + food)
  		  })*/
    		var fooditem = new Meal({ 
    		    fooditem: collection[i].Item.text.toLowerCase(),
    		    meals: meal,
    		    dininghalls: dininghall 
    		});


  		fooditem.save(function (err, fooditem) {
    		    if (err) return console.error(err);
    		    console.log('save successful')
    		    //fluffy.speak();
  		});

    	    }
    	    Meal.find(function(err, food){
		if (err) return console.error(err);
 		console.log('I found' + food)

	    })
	    //throw "exit";
    	    //console.log(dhinfo.results.collection1[0].Item.text)
  	});
    }).on('error', function(e) {
  	console.log("Got error: " + e.message);
  	return null
    });
}

function whichmeal(){
    var hour = date.getHours()
    if(hour <= 11)return 'breakfast'
    else if(hour >= 5 )return 'dinner'
    else return 'lunch'		
}

var date = new Date()

mongoose.connect(uristring, function (err, res) {
    if (err) {
	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
	// yay!
	var foodSchema = mongoose.Schema({
	    fooditem: String,
	    meals: String,
	    dininghalls: String
	})

	foodSchema.methods.registerMeal = function (food) {
	    this.meals.push(food)
	    console.log('Food pushed')
	}

	foodSchema.methods.registerDiningHall = function (dh){
	    this.meals.push(dh)
	    console.log('dh pushed')
	}



	/*
	//var silence = new Meal({ name: 'Silence' })
	//console.log(silence.name) // 'Silence'
	//var fluffy = new Kitten({ name: 'fluffy' });

	//fluffy.save(function (err, fluffy) {
	//if (err) return console.error(err);
	console.log('save successful')
	//fluffy.speak();
	});
	*/

	Meal = mongoose.model('Meal', foodSchema);

	var date = new Date()

	var foodSchema = mongoose.Schema({
	    fooditem: String,
	    meals: String,
	    dininghalls: String
	})

	foodSchema.methods.registerMeal = function (food) {
	    this.meals.push(food)
	    console.log('Food pushed')
	}

	foodSchema.methods.registerDiningHall = function (dh){
	    this.meals.push(dh)
	    console.log('dh pushed')
	}



	/*
	//var silence = new Meal({ name: 'Silence' })
	//console.log(silence.name) // 'Silence'
	//var fluffy = new Kitten({ name: 'fluffy' });

	//fluffy.save(function (err, fluffy) {
	//if (err) return console.error(err);
	console.log('save successful')
	//fluffy.speak();
	});
	*/


	Meal.find(function (err, food) {
	    if (err) return console.error(err);
	    console.log(food)
	})

    }
});

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

    app.get('/send',function(req,res){

	// These vars are your accountSid and authToken from twilio.com/user/account
	///send?to=2025961749&message=helloworld

	var args = req.query;

	client.messages.create({
            body: args.message,
            to: args.to,
            from: "+2406502344",
	}, function(err, message) {
            if (err) {
		console.log(err);
		res.send(err);

            }
            console.log(message.sid);
            res.send(message.sid);
	});
    });

    app.get('/recv',function(req,res){
	var message = req.body.Body;
	var from = req.body.From;
	var tokens = message.split(" ");
	var location = tokens[0].toLowerCase();
	var food = tokens[1].toLowerCase();

	getClosest(location,food);
    });

    app.get('/text',function(req,res){

	var url = require('url');
	var query = url.parse(request.url,true).query;

	getClosest(query.location,query.food);
    });

    app.get('/joe', function(req, res){
	//sending maybe food, maybe location
	//returning list of dining halls 
	var message = req.query.message.toLowerCase();
	message = message.replace(/^\s+|\s+$/g,'')
	console.log(message)
/*
	Meal.find({'fooditem':message, 'meals': whichmeal()}, 'dininghalls', function(err, dhs){
	    if (err) return handleError(err);
  	    //console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation)
  	    console.log(dhs)
            res.send(dhs);
	}
*/
	Meal.find(function (err, food) {
	    if (err) return console.error(err);
	    console.log(food)
	    res.send(food);
	})
		  //console.log(req.route.params);
		 })

    app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
    });

    app.get('/scrape', function(req, res){
       res.send('scraped') 
httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=30&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Breakfast+++served+until+11am&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'breakfast', 'eight')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=30&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Lunch served until 2pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'eight')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=30&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Dinner+served+until+8pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'eight')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=5&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Breakfast+++served+until+11am&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'breakfast', 'cowell')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=5&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Lunch served until 2pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'cowell')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=5&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Dinner+served+until+8pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'dinner', 'cowell')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=20&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Breakfast+++served+until+11am&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'breakfast', 'crown')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=20&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Lunch served until 2pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'crown')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=20&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Dinner+served+until+8pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'dinner', 'crown')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=25&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Breakfast+++served+until+11am&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'breakfast', 'porter')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=25&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Lunch served until 2pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'porter')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=25&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Dinner+served+until+8pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'dinner', 'porter')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=40&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Breakfast+++served+until+11am&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'breakfast', 'nine')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=40&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Lunch served until 2pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'lunch', 'nine')

httpGet('http://www.kimonolabs.com/api/ce6dd1oc?&?locationNum=40&dtdate=' 
	+ date.getMonth() + '%2F' + date.getDate() + '%2F' + date.getYear() + 
	'&Dinner+served+until+8pm&apikey=2323b50a71ade7d336c82c9f9dd5c072', 'dinner', 'nine')
    });

    app.listen(port);

