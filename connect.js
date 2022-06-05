var db = require( 'db' );

db.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );