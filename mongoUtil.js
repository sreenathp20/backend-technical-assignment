const MongoClient = require( 'mongodb' ).MongoClient;
var config = require('./config.js');

var url = `mongodb+srv://${config.USERNAME}:${config.PASSWORD}@${config.HOST}/?retryWrites=true&w=majority`;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      console.log(err, " err")
      console.log(client, " client")
      console.log(url)
      _db  = client.db('mydb');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};