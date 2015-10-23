var express = require("express");
var fs = require("fs");
var mongoos = require("mongoose");
var jsonpath = require("JSONPath");
var app = express();
var parking = express();
var home = express();
var stats = express();
var parking_json = __dirname + "/" + "parking_lots.json";
var dummy_json = __dirname + "/" + "dummy.json";
var t_115_stats = __dirname + "/" + "t_115_stats.json";
global.inc = 0;
global.free_lots = 190;

app.use(express.static('web'));

home.get('/', function(req, res) {
	console.log(__dirname);
	res.send('Welcome at Parking Lot App');
});

home.get('/web', function(req, res) {
	res.sendfile('web/index.html');
});

parking.get('/', function(req, res) {
	console.log(__dirname);
	fs.readFile( parking_json, 'utf8', function (err, data) {
		console.log(data);
		res.end( data );
	});
});

function randomRange(low, high) {
	return Math.floor(Math.random() * (high - low +1)) + low;
}

parking.get('/:id', function(req, res) {
	var file = fs.readFileSync(parking_json, "utf-8");
	var id = req.params.id;
	console.log("file " + file);
	console.log("id " + id);
	var jsonContent = JSON.parse(file);
	var jsonData = jsonContent.data[id];
	var incrementer = 0.1
	console.log(inc);
	jsonData.available_lots = free_lots;
	//jsonData.available_lots = 190;
		//20 capacity maximum = morning (7 - 8) - add
		if (inc < 51) {
			if (jsonData.available_lots < 170) {
				jsonData.available_lots += randomRange(2,5); //Math.floor(Math.random() * 5) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if(jsonData.available_lots % 2 == 0 && jsonData.available_lots > 180 && inc < 51) {
				if (jsonData.available_lots > 190) {
					jsonData.available_lots -= randomRange(2,3);//Math.floor(Math.random() * 3) + 2
					free_lots = jsonData.available_lots
					inc +=incrementer
				}
				else jsonData.available_lots -= randomRange(2,5);//Math.floor(Math.random() * 5) + 2
					free_lots = jsonData.available_lots
					inc+=incrementer	
			}
		// 20 capacity maximum = morning (7 - 8) - remove
			else if(jsonData.available_lots % 3 == 0 && jsonData.available_lots > 180 && inc < 51) {
				jsonData.available_lots += randomRange(2,5);//Math.floor(Math.random() * 5) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else {jsonData.available_lots -= randomRange(2,5);//Math.floor(Math.random() * 5) + 2
				inc +=incrementer
				free_lots = jsonData.available_lots
			}	
		}	
		// morning (8 - 12) - add more	
		else if (inc > 51 && inc < 121) {
			console.log(">51 loop");
			// add more often
			if (jsonData.available_lots < 5 ) {
				jsonData.available_lots += randomRange(2,4);//Math.floor(Math.random() * 4) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if (jsonData.available_lots % 2 == 0 && jsonData.available_lots > 5 && inc < 121) {
				if (jsonData.available_lots < 34) {
					jsonData.available_lots -= randomRange(3,jsonData.available_lots - 5)
					inc +=incrementer
					free_lots = jsonData.available_lots
				}
				else jsonData.available_lots -= randomRange(2,5);//Math.floor(Math.random() * 20) + 13
					inc +=incrementer
					free_lots = jsonData.available_lots
			}
			
			// remove less often
			else if (jsonData.available_lots % 19 == 0 && jsonData.available_lots > 5 && inc < 121) {
				jsonData.available_lots += randomRange(2,4);//Math.floor(Math.random() * 4) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if(jsonData.available_lots > 5 && inc < 121) {
				jsonData.available_lots -= randomRange(1,2);//Math.floor(Math.random() * 2) + 1
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else {jsonData.available_lots += randomRange(1,2);//Math.floor(Math.random() * 2) + 1
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
		}
		else if(inc > 121 && inc < 221) {
			if (jsonData.available_lots < 5) {
				jsonData.available_lots += randomRange(2,4);//Math.floor(Math.random() * 4) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if(jsonData.available_lots % 2 == 0 && jsonData.available_lots > 5 && inc < 221 ) {
				jsonData.available_lots -= Math.floor(Math.random() * 3) + 1
				free_lots = jsonData.available_lots
				inc+=incrementer	
			}
		// 20 capacity maximum = morning (7 - 8) - remove
			else if(jsonData.available_lots % 3 == 0 && jsonData.available_lots > 5 && inc < 221) {
				jsonData.available_lots -= Math.floor(Math.random() * 2) + 1
				inc+=incrementer
				free_lots = jsonData.available_lots
			}	
			else if (jsonData.available_lots % 3 == 0 && jsonData.available_lots < 5 && inc < 221){
				jsonData.available_lots += Math.floor(Math.random() * 2) + 1
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else jsonData.available_lots += Math.floor(Math.random() * 2) + 1
				inc+=incrementer
				free_lots = jsonData.available_lots
		}
		else if (inc > 221 && inc < 281) {
			if (jsonData.available_lots > 180) {
				jsonData.available_lots -= Math.floor(Math.random() * 4) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if (jsonData.available_lots % 2 == 0 && jsonData.available_lots > 0 && inc < 281) {
				if (jsonData.available_lots < 160 ){
					jsonData.available_lots += randomRange(3,7);//Math.floor(Math.random() * 25) + 13
					inc +=incrementer
					free_lots = jsonData.available_lots
				}
				else if(jsonData.available_lots < 39) {
					jsonData.available_lots += Math.floor(Math.random() * 5) + 2
					inc +=incrementer
					free_lots = jsonData.available_lots
				}
				else if (jsonData.available_lots < 5 ) {
					jsonData.available_lots += Math.floor(Math.random() * 5) + 2
					inc +=incrementer
					free_lots = jsonData.available_lots
				}
				else jsonData.available_lots -= Math.floor(Math.random() * 3) + 2
					inc +=incrementer
					free_lots = jsonData.available_lots
			}
			else if (jsonData.available_lots % 19 == 0 && jsonData.available_lots > 39 && inc < 281) {
				jsonData.available_lots -= Math.floor(Math.random() * 5) + 2
				inc +=incrementer
				free_lots = jsonData.available_lots
			}
			else jsonData.available_lots += Math.floor(Math.random() * 8) + 2
				inc +=incrementer
				free_lots = jsonData.available_lots
		}	
		else if (inc > 281 && inc < 301) {
			if (jsonData.available_lots > 180) {
				jsonData.available_lots -= Math.floor(Math.random() * 4) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else if(jsonData.available_lots % 2 == 0 && jsonData.available_lots < 301) {
				jsonData.available_lots += Math.floor(Math.random() * 5) + 2
				free_lots = jsonData.available_lots
				inc+=incrementer	
			}
		
			else if(jsonData.available_lots % 3 == 0 && jsonData.available_lots < 301) {
				jsonData.available_lots -= Math.floor(Math.random() * 5) + 2
				inc+=incrementer
				free_lots = jsonData.available_lots
			}
			else {jsonData.available_lots += Math.floor(Math.random() * 5) + 2
				free_lots = jsonData.available_lots
				inc+=incrementer
			}
		}
		else if (inc > 301) {
			inc = 0;
			free_lots = 190;
		}	
		
	//jsonData.available_lots = 120 + Math.floor((Math.random() * 10 - 4));
	//console.log("jsonContent " + JSON.stringify(jsonData));
	res.send(jsonData);
});

parking.get('/', function(req, res) {
	console.log(__dirname);
	fs.readFile( t_115_stats.json, 'utf8', function (err, data) {
		console.log(data);
		res.end( data );
	});
});

stats.get("/:id", function(req, res) {
	console.log("Statistics for particular parking lot usage");
	var file = fs.readFileSync(t_115_stats, "utf-8");
	var id = req.params.id;
	var start_date = req.query.start_date;
	var end_date = req.query.end_date;
	var jsonContent = JSON.parse(file);
	console.log("id " +id);
	if(id == jsonContent.parking_lot_id) {
		console.log(id + " capacity = " + JSON.stringify(jsonContent.capacity));
		var parseDatesString = "$.data[?(@.date_time>'"+ start_date +"')]";
		var parseEndDatesString = "$.data[?(@.date_time<'"+ end_date +"')]";
		var parseNewDatesString = "$.data[?(@.date_time>'"+start_date+"')]"
		var data = jsonpath.eval(jsonContent, parseDatesString);
		//console.log(JSON.stringify(data));
		var endData = jsonpath.eval(jsonContent, parseEndDatesString);
		console.log("dates between start and end date: " + JSON.stringify(endData));
		var newData = jsonpath.eval(endData, parseNewDatesString);
		console.log("new dates " + newData);
		console.log("new dates " + JSON.stringify(newData));

		//console.log(parseEndDatesString);

	}
	res.send(jsonContent.capacity);

})

app.use("/", home);
app.use("/parking_lots", parking);
app.use("/stats", stats);
var port = process.env.PORT || 5000;
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
