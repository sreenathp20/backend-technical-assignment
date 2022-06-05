var express = require('express'),
    router = express.Router();
const config = require('./config.js')

var mongoUtil = require( './mongoUtil' );
var Promise = require("bluebird");

var request = Promise.promisifyAll(require('request'));

function getEpochTime(iso) {
    let arr = iso.split("T");
    let fromTime = arr[0] + "T00:00:00";
    let toTime = arr[0] + "T23:59:59";
    //console.log(arr, fromTime, toTime);
    let epochFromTime = Math.floor(new Date(fromTime).getTime() / 1000);
    let epochToTime = Math.floor(new Date(toTime).getTime() / 1000)
    return [epochFromTime, epochToTime];
}

router
  // Add a binding to handle '/tests'
  .get('/test', async function(req, res){
    // render the /tests view
    var db = mongoUtil.getDb();
    test = await db.collection( 'test' ).findOne({});
    console.log(test.test)
    res.send('OK');
  })
  .get('/indego', async function(req, res){
    // render the /tests view
    var db = mongoUtil.getDb();
    const url = config.indegoApi;
    request.get(url, async (error, response, body) => {
            let json = await JSON.parse(body);  
            json.features.map((element) => {
                return element.timestamp = Math.floor(new Date().getTime() / 1000)
            });
            db.collection( config.collection.indego ).insertMany(
                json.features,
                {
                }
             )
            res.send('Data inserted successfully');
    });
    
  })
  .get('/weather', async function(req, res){
    // render the /tests view
    var db = mongoUtil.getDb();
    const url = `${config.weather.url}?q=${config.weather.location}&appid=${config.weather.apiKey}`
    request.get(url, async (error, response, body) => {
            let json = await JSON.parse(body);
            db.collection( config.collection.weather ).insertOne(
                json,
                {
                }
             )
            //console.log(json);
            res.send('Data inserted successfully');
    });
  })
  .get('/api/v1/stations', async function(req, res){
    // render the /tests view
    var db = mongoUtil.getDb();
    let at = req.query.at;
    console.log(at)
    if(at == undefined) {
        res.send('Time not provided');
    }
    let times = getEpochTime(at);
    let epochFromTime = times[0];
    let epochToTime = times[1];
    let epochTime = Math.floor(new Date(at).getTime() / 1000);
    console.log(epochFromTime, epochToTime);
    let cursor = db.collection( config.collection.indego ).find({timestamp: {$gte: epochTime}});
    let weatherCursor = db.collection( config.collection.weather ).find({dt: {$gte: epochTime}}, {sort: {dt: 1}});
    let count = await cursor.count();
    let arr = [];
    await cursor.forEach(function(res) {
        arr.push(res);
    });
    let weather = [];
    await weatherCursor.forEach(function(res) {
        weather.push(res);
    });
    //console.log(arr, "arr")
    res.send({at: at, stations: arr, weather: weather[0]});
  })
  .get('/api/v1/stations/:kioskId', async function(req, res){
    // render the /tests view
    let kioskId = req.params.kioskId
    //console.log("kioskId", kioskId)
    var db = mongoUtil.getDb();
    let at = req.query.at;
    if(kioskId == undefined) {
        res.send('kioskId not provided');
    }
    if(at == undefined) {
        res.send('Time not provided');
    }
    let epochTime = Math.floor(new Date(at).getTime() / 1000);
    let cursor = db.collection( config.collection.indego ).find({"properties.kioskId": parseInt(kioskId), timestamp: {$gte: epochTime}}, {sort: {timestamp: 1}});
    //console.log(epochTime, " epochTime ", kioskId, " kioskId ")
    let weatherCursor = db.collection( config.collection.weather ).find({dt: {$gte: epochTime}}, {sort: {dt: 1}});
    //let count = await cursor.count();
    let arr = [];
    await cursor.forEach(function(res) {
        arr.push(res);
    });
    let weather = [];
    await weatherCursor.forEach(function(res) {
        weather.push(res);
    });
    //console.log(count, "count")
    res.send({at: at, station: arr[0], weather: weather[0]});
  })
  
module.exports = router;