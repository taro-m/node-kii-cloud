// vim:set sts=2 sw=2 tw=0 et:

var https = require('https');
var url = require('url');

var CONFIG = {
  US: {
    baseURL: "https://api.kii.com/api/",
  },
  JP: {
    baseURL:"https://api-jp.kii.com/api/",
  },
  CN: {
    baseURL: "https://api-cn2.kii.com/api/",
  },
};

function readAllBody(res, callback) {
  var data = '';
  res.on('readable', function() {
    data += res.read();
  });
  res.on('end', function() {
    callback(data);
  });
}

function Context(region, appID, appKey) {
  var config = CONFIG[region];
  if (config === void(0)) {
    throw new Error("Invalid region: " + region);
  }
  this.config = config;
  this.baseURL = config.baseURL;
  this.appID = appID;
  this.appKey = appKey;
}

Context.prototype.setupAccessToken = function(id, secret, callback) {
  var options = url.parse(this.baseURL + 'oauth2/token');
  options.method = 'POST';
  options.headers = {
      'content-type': 'application/json',
      'x-kii-appid': this.appID,
      'x-kii-appkey': this.appKey,
  };
  var data = {
    client_id: id,
    client_secret: secret,
  };
  var req = https.request(options, handleResponse);
  req.end(JSON.stringify(data));

  function handleResponse(res) {
    if (res.statusCode != 200) {
      res.setEncoding('utf8');
      readAllBody(res, function(){
        callback(null);
      });
    } else {
      res.setEncoding('utf8');
      readAllBody(res, handleBody);
    }
  }

  function handleBody(body) {
    var retval = JSON.parse(body);
    this.accessToken = retval.access_token;
    this.expiresIn = retval.expires_in;
    callback(this.accessToken);
  }
}

Context.prototype.getAccessToken = function(clientID, clientSecret) {
  return this.accessToken;
}

module.exports.Context = Context;
