"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 3000; //80 usually for development, requires admin


var config = JSON.parse(fs.readFileSync('config.json'));
var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];
//var chess = fs.readFileSync('images/chess.jpg');
//var fern = fs.readFileSync('images/fern.jpg');


function getImageNames(callback){
  fs.readdir('images/', function(err, fileNames) {
    if(err) callback(err, undefined);
    else callback(false, fileNames);
  });
}

function imageNamesToTags(fileNames) {
  // console.log(fileNames, " imageNamesToTags");
  return fileNames.map(function(fileName) {
    return `<img src = "${fileName}" alt="${fileName}">`;
  });
}

function buildGallery(imageTags) {
  // console.log(imageTags, " buildGallery");
  var html = '<!doctype html>';
      html += '<head>';
      html += '<title>' + config.title + '</title>';
      html += '<link href="/gallery.css" rel="stylesheet" type="text/css">'
      html += '</head>';
      html += '<body>';
      html += ' <h1>' + config.title + '</h1>';
      html += '<form action="' //finish
      html += imageNamesToTags(imageTags).join('');
      html += ' <h1>Hello.</h1> Time is ' + Date.now();
      html += '</body>';
  return html;
}

function serveGallery(req, res) {
  //Here?
  getImageNames(function(err, imageNames){
    if(err){
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = 'Server error';
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.end(buildGallery(imageNames));
  });
}

function serveImage(filename, req, res) {
  var body = fs.readFile('images/' + filename, function(err, body) {
    if (err) {
      console.error(err);
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      return;
    }

  res.setHeader("Content-Type", "image/jpg");
  res.end(body);
  });
}



var server = http.createServer((req, res) => {

  // At most, the url shuld have two parts-
  // a resource and a querystring separated by a ?
  var urlParts= url.parse(req.url);

  if (urlParts.query) {
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if (matches && matches[1]) {
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
  }

  switch(urlParts.pathname) {
    case '/':
    case "/gallery":
      serveGallery(req, res);
      break;
    case "/gallery.css":
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      serveImage(req.url, req, res);
  }
});

server.listen(port, ()=> {
	console.log("Listening on Port " + port);
});
