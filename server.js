/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
"use strict;"

/* global variables */
var multipart = require('./multipart');
var template = require('./template');
// var staticFiles = require('./static');
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 3000;

/* load cached files */
var config = JSON.parse(fs.readFileSync('config.json'));
var stylesheet = fs.readFileSync('public/gallery.css');
var gallery = JSON.parse(fs.readFileSync('gallery.json'));
var script = fs.readFileSync("public/gallery.js");



/* load public directory */
// staticFiles.loadDir('public');

/* load templates */
template.loadDir('templates');


/** @function getImageNames
 * Retrieves the filenames for all images in the
 * /images directory and supplies them to the callback.
 * @param {function} callback - function that takes an
 * error and array of filenames as parameters
 */
function getImageNames(callback) {
  fs.readdir('images/', function(err, fileNames){
    if(err) callback(err, undefined);
    else callback(false, fileNames);
  });
}

// function getImageNamesJSON(json, callback) {
//   var imgNames = [json.length];
//   for(var i = 0; i < json.length; i++) {
//     imgNames[i] = json[i].image;
//   }
//   return imgNames;
// }

// /** @function imageNamesToTags
//  * Helper function that takes an array of image
//  * filenames, and returns an array of HTML img
//  * tags build using those names.
//  * @param {string[]} filenames - the image filenames
//  * @return {string[]} an array of HTML img tags
//  */
// function imageNamesToTags(fileNames) {
//   return fileNames.map(function(fileName) {
//     return `<img id="smallPic" src="${fileName}" alt="${fileName}" style="cursor:pointer">` /*onclick="showImage(${fileName})">`*/;
//
//   });
// }

function imageNamesToTagsJSON(json) {
  var tags = '';
  for(var i = 0; i < json.length; i++) {
    tags += `<a href="#"><img class="smallPic" src="` + json[i].image +
            `" data-title="` + json[i].title +
            `" data-desc="`  + json[i].description +
            `" alt="`        + json[i].title +
            `" onclick="showImage(` + i + `)"` +
            `  style="cursor:pointer"></a>`;
  }
  // console.log(tags);
  return tags;
}

/**
 * @function buildGallery
 * A helper function to build an HTML string
 * of a gallery webpage.
 * @param {string[]} imageTags - the HTML for the individual
 * gallery images.
 */
function buildGallery(imageTags) {
  return template.render('gallery.html', {
    title: config.title,
    // imageTags: imageNamesToTags(imageTags).join('')
    imageTags: imageNamesToTagsJSON(gallery)
  });
}

/** @function serveGallery
 * A function to serve a HTML page representing a
 * gallery of images.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function serveGallery(req, res) {
  getImageNames(function(err, imageNames){
    if(err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = 'Server error';
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.end(buildGallery(imageNames));
  });
  // res.setHeader('Content-Type', 'text/html');
  // res.end(buildGallery(getImageNamesJSON(gallery)));
}

/** @function serveImage
 * A function to serve an image file.
 * @param {string} filename - the filename of the image
 * to serve.
 * @param {http.incomingRequest} - the request object
 * @param {http.serverResponse} - the response object
 */
function serveImage(fileName, req, res) {
  fs.readFile('images/' + decodeURIComponent(fileName), function(err, data){
    if(err) {
      console.error(err);
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'image/*');
    res.end(data);
  });
}

/** @function uploadImage
 * A function to process an http POST request
 * containing an image to add to the gallery.
 * @param {http.incomingRequest} req - the request object
 * @param {http.serverResponse} res - the response object
 */
function uploadImage(req, res) {
  multipart(req, res, function(req, res) {
    // make sure an image was uploaded
    if(!req.body.image.filename) {
      console.error("No file in upload");
      res.statusCode = 400;
      res.statusMessage = "No file specified"
      res.end("No file specified");
      return;
    }
    fs.writeFile('images/' + req.body.image.filename, req.body.image.data, function(err){
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.statusMessage = "Server Error";
        res.end("Server Error");
        return;
      }
      serveGallery(req, res);
      gallery.push({
        description: req.body.description,
        image: req.body.image.filename,
        title: req.body.title
      });
      fs.writeFile('gallery.json', JSON.stringify(gallery, null, "\t"));
    });

  });
}

/** @function handleRequest
 * A function to determine what to do with
 * incoming http requests.
 * @param {http.incomingRequest} req - the incoming request object
 * @param {http.serverResponse} res - the response object
 */
function handleRequest(req, res) {
  // at most, the url should have two parts -
  // a resource and a querystring separated by a ?
  var urlParts = url.parse(req.url);

  if(urlParts.query){
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if(matches && matches[1]){
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
  }

  switch(urlParts.pathname) {
    case '/':
    case '/gallery':
      if(req.method == 'GET') {
        serveGallery(req, res);
      } else if(req.method == 'POST') {
        uploadImage(req, res);
      }
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    case '/gallery.js':
      res.setHeader('Content-Type', 'text/javascript');
      res.end(script);
      break;
    default:
      // if (staticFiles.isCached('public' + req.url)) {
      //   staticFiles.serveFile('public' + req.url, req, res);
      // }
      // else
      serveImage(req.url, req, res);
  }
}

/* Create and launch the webserver */
var server = http.createServer(handleRequest);
server.listen(port, function(){
  console.log("Server is listening on port ", port);
});
