var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

var retureFailure = false;

mbaasApi.sync.init('tasks', {
  logLevel: 'silly',
  syncFrequency: 1
}, function(){
  
});

// Securable endpoints: list the endpoints which you want to make securable here
var securableEndpoints = ['hello'];

var app = express();

// Enable CORS for all requests
app.use(cors());

app.use('/setFailure/:value', function(req, res){
  retureFailure = req.params.value === "true";
  return res.json({current: retureFailure});
});

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', function(req, res, next){
  if(retureFailure){
    return res.send(500);
  } else {
    return mbaasExpress.mbaas(req, res, next);
  }
});

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/cloud/echo', require('./lib/echo.js')());

app.use('/echo', require('./lib/echo.js')());

app.use('/syncTest', require('./lib/syncTest.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
var server = app.listen(port, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});