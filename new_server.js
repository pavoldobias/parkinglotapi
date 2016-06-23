var loopback = require('loopback');
var path = require('path');

var app = module.exports = loopback();

app.set('restApiRoot', '/api');

var ds = loopback.createDataSource('soap',
    {
        connector: require('loopback-connector-soap'),
        remotingEnabled: true,
        wsdl: 'http://ws.villapro.eu:8888/?wsdl' // The url to WSDL
    });

// Unfortunately, the methods from the connector are mixed in asynchronously
// This is a hack to wait for the methods to be injected
ds.once('connected', function () {

    // Create the model
    var ParkingLotService = ds.createModel('ParkingLotService', {});

    // Refine the methods
    ParkingLotService.freespaces = function (id, cb) {
        ParkingLotService.GetFreePlacesForArticle({
            sourceUUID: 'user-8161fb80-36e6-11e6-ac61-9e71128cae77',
            destinationUUID: 'parker-5c74333d-a0e4-440d-844f-b23fefbed4f1',
            articleID: id
        }, function (err, response) {
            console.log(response);
            var result = response;
            cb(err, result);
        });
    };

    // Map to REST/HTTP
    loopback.remoteMethod(
        ParkingLotService.freespaces, {
            accepts: [
                {
                    arg: 'id', type: 'number', required: true,
                    http: {source: 'query'}
                }
            ],
            returns: {arg: 'result', type: 'object', root: true},
            http: {verb: 'get', path: '/freespaces'}
        }
    );

    // Expose to REST
    app.model(ParkingLotService);

    // LoopBack REST interface
    app.use(app.get('restApiRoot'), loopback.rest());
    // API explorer (if present)
    try {
        var explorer = require('loopback-explorer')(app);
        console.log('explorer started');
        app.use('/explorer', explorer);
        app.once('started', function (baseUrl) {
            console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
        });
    } catch (e) {
        console.log(
            'Run `npm install loopback-explorer` to enable the LoopBack explorer'
        );
    }

    app.use(loopback.urlNotFound());
    app.use(loopback.errorHandler());

    if (require.main === module) {
        app.start();
    }


});

app.start = function () {
    return app.listen(3000, function () {
        var baseUrl = 'http://127.0.0.1:3000';
        app.emit('started', baseUrl);
        console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    });
};


