var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

function echoRoute() {
  var echo = new express.Router();
  echo.use(cors());
  echo.use(bodyParser());

  var getData = function(req){
    var data = {
      method: req.method,
      headers: req.headers
    };
    if(req.query){
      data.query = req.query;
    }
    if(req.body){
      data.body = req.body;
    }
    console.log("Return data : ", data);
    return data;
  }

  // GET REST endpoint - query params may or may not be populated
  echo.get('/', function(req, res) {
    var data = getData(req);
    return res.json(data);
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  echo.post('/', function(req, res) {
    var data = getData(req);
    return res.json(data);
  });

  return echo;
}

module.exports = echoRoute;