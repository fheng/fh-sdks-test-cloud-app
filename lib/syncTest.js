var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fh = require('fh-mbaas-api');
var util = require('util');
var async = require('async');

function syncTestRoute(){
  var syncTest = new express.Router();
  syncTest.use(cors());
  syncTest.use(bodyParser());
  
  //will be called by tests to remove all the existing data to setup db
  syncTest['delete']('/:datasetId', function(req, res){
    var datasetId = req.params.datasetId;
    console.log("Going to delete all the data for dataset " + datasetId);
    async.parallel([function(cb){
      fh.db({
        act:'deleteall',
        type: datasetId 
      }, cb);
    }, function(cb){
      fh.db({
        act:'deleteall',
        type: datasetId + '-updates'
      }, cb);
    }], function(err, results){
      if(err){
        console.log("Got error when deleteall existing data", util.inspect(err));
        res.send(500, util.inspect(err));
      } else {
        res.json(results);
      }
    });
  });

  syncTest.get('/:datasetId', function(req, res){
    var datasetId = req.params.datasetId;
    setTimeout(function(){
      fh.db({
        act: 'list',
        type: datasetId
      }, function(err, results){
        if(err){
          console.log("failed to list data for collection: " + datasetId, util.inspect(err));
          res.send(500, util.inspect(err));
        } else {
          console.log("Got data for dataset : " + datasetId + " : data : " + JSON.stringify(results));
          res.json(results);
        }
      });
    }, 500);
  });

  syncTest.post('/:datasetId', function(req, res){
    var datasetId = req.params.datasetId;
    var data = req.body;
    console.log("Got data for creating " + datasetId + " : " + JSON.stringify(data));
    fh.db({
      act: 'create',
      type: datasetId,
      fields: data
    }, function(err, results){
      if(err){
        console.log("Failed to create data", util.inspect(err));
        res.send(500, util.inspect(err));
      } else {
        console.log("data created: ", results);
        res.json(results);
      }
    });
  });

  return syncTest;
}

module.exports = syncTestRoute;