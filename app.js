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

parking.get('/:id', function(req, res) {
	var file = fs.readFileSync(parking_json, "utf-8");
	var id = req.params.id;
	console.log("file " + file);
	console.log("id " + id);
	var jsonContent = JSON.parse(file);
	var jsonData = jsonContent.data[id];
	jsonData.available_lots = 120 + Math.floor((Math.random() * 5 - 2));
	console.log("jsonContent " + JSON.stringify(jsonData));
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
