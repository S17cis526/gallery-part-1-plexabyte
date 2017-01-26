"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var fs = require('fs');
var port = 3000; //80 usually for development, requires admin

var server = http.createServer((req, res) => {

  switch(req,url) {
    case "/chess":
    var body = fs.readFileSync('images/chess.jpg');
    res.setHeader("Content-Type", "image/jpeg");
    res.end(body);
    break;
  default:
    res.statusCode = 404;
    res.statusMessage = "Not Found";
  }

});

server.listen(port, ()=> {
	console.log("Listening on Port " + port);
});
