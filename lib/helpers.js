/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var queryString = require('querystring');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

// send an SMS message via Twillio
helpers.sendTwilioSms = function(phone,msg,callback){
  // validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg   = typeof(msg) == 'string' && msg.trim().length >= 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg) {
    // configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : `+1${phone}`,
      'Body': msg
    };

    // stringyfy the payload
    var stringPayload = queryString.stringify(payload);

    // configure the request details
    var requestDetails = {
      'protocol': 'https:',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Message.json',
      'auth': `${config.twilio.accountSid}:${config.twilio.authToken}`,
      'headers': {
        'Content-Type': 'application/x-wwww-form-urlencoded',
        'Content-Length': Buffer.byteLegth(stringPayload)
      }
    }

    // Instantiate the request object
    var req = https.request(requestDetails, function(res) {
      // status of send request
      var status = res.statusCode;
      // callback successfully if request went through
      if(status == 200 || status == 201) {
        callback(false);
      } else {
        callback(`StatusCode returned was ${status}`);
      }
    });

    // bind the error event so it doesn't get throwned
    req.on('error',function(e) {
      callback(e);
    });

    // add the payload
    req.write(stringPayload);

    // end the request
    req.end();

  } else {
    callback('Given params were missing or invalid');
  }
}
// Export the module
module.exports = helpers;
