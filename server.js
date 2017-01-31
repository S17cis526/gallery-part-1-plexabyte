"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var fs = require('fs');
var port = 3000; //80 usually for development, requires admin

//var chess = fs.readFileSync('images/chess.jpg');
//var fern = fs.readFileSync('images/fern.jpg');

function serveImage(filename, req, res) {
  var body = fs.readFile('images/' + filename, function(err, body) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = "whoops";
      res.end("silly me");
      return;
    }

  res.setHeader("Content-Type", "image/jpeg");
  res.end(body);
  });
}


var server = http.createServer((req, res) => {

  switch(req.url) {
    case "/gallery":
      var html = '<!doctype html>';
          html += '<head><title>Gallery</title></head>';
          html += '<body>';
          html += ' <h1>Gallery</h1>';
          html += ' <image src = "/ace.jpg" alt="a fishing ace at work">';
          html += ' <h1>Hello.</h1> Time is ' + Date.now();
          html += '</body>';
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      break;
    case "/chess":
    case "/chess.jpg":
      serveImage('chess.jpg', req, res);
      //res.end(chess);
      break;
    case "/fern":
    case "/fern/":
    case "/fern.jpg":
    case "/fern.jpeg":
      serveImage('fern.jpg', req, res);
      //res.end(fern);

      break;
    case "/mobile":
      serveImage('mobile.jpg', req, res);
      break;
    case "/ace":
    case "/ace.jpg":
      serveImage('ace.jpg', req, res);
      break;
    case "/bubble":
    case "/bubble.jpg":
      serveImage('bubble.jpg', req, res);
      break;
  default:
    res.statusCode = 404;
    res.statusMessage = "Not Found";
    res.end();
  }
});

server.listen(port, ()=> {
	console.log("Listening on Port " + port);
});
