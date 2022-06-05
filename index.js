require('./connect.js');

var db = require( './db.js' );
var DB = db.getDb();

let test = DB.collection('test');

let res = test.findOne({});

console.log(res)