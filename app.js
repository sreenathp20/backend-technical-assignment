const express = require('express')
const config = require('./config.js')
const app = express()
const port = process.env.PORT || config.PORT
const router = require('./router');

var mongoUtil = require( './mongoUtil' );

mongoUtil.connectToServer( function( err, client ) {
  if (err) {
    console.log(err);
    console.log("log here!!!!!!!")
  } 
  // start the rest of your app here
} );

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})