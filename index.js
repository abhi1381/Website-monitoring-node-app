/*
 * Primary file for API
 *
 */


// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

 // instantiate the httpserver
var httpServer = http.createServer(function(req,res){
    combinedServer(req,res);
});

// Start the server
httpServer.listen(config.httpPort,function(){
  console.log(`The server is up and running now on port ${config.httpPort} in ${config.envName} environment`);
});

// https options
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert':  fs.readFileSync('./https/cert.pem')
}

 // instantiate the httpsServer
 var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    combinedServer(req,res);
});

// Start the server
httpsServer.listen(config.httpsPort,function(){
  console.log(`The server is up and running now on port ${config.httpsPort} in ${config.envName} environment`);
});


// server logic for both http and htttps
var combinedServer = function(req,res) {
      // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type','application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);
      });
  });
}

// Define all the handlers
var handlers = {};

// ping handler
handlers.ping = function(data,callback){
    callback(200,{'name':'ping handler'});
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Define the request router
var router = {
  'ping' : handlers.ping
};

