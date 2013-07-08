// vim:set sts=2 sw=2 tw=0 et:

var https = require('https');
var url = require('url');

var CONFIG = {
  US: {
    baseURL: 'https://api.kii.com/api/',
  },
  JP: {
    baseURL:'https://api-jp.kii.com/api/',
  },
  CN: {
    baseURL: 'https://api-cn2.kii.com/api/',
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

function mergeObject(dst, src) {
  if (src != null) {
    for (var key in src) {
      dst[key] = src[key];
    }
  }
  return dst;
}

function Context(region, appID, appKey) {
  var config = CONFIG[region];
  if (config === void(0)) {
    throw new Error('Invalid region: ' + region);
  }
  this.config = config;
  this.baseURL = config.baseURL;
  this.appID = appID;
  this.appKey = appKey;
}

Context.prototype.requestJSON = function(method, requrl, headers, reqobj, callback) {
  var options = url.parse(requrl);
  var baseHeaders = {
      'x-kii-appid': this.appID,
      'x-kii-appkey': this.appKey,
  }
  if (reqobj !== null) {
    options.method = 'POST';
    baseHeaders['content-type'] = 'application/json';
  }
  if (method != null) {
    options.method = method;
  }
  options.headers = mergeObject(baseHeaders, headers);

  function handleResponse(res) {
    res.setEncoding('utf8');
    readAllBody(res, function(data) {
      var resobj;
      res.data = data;
      try {
        resobj = JSON.parse(data);
      } catch (e) {
        res.parseError = e;
      }
      callback(res, resobj);
    });
  }

  var req = https.request(options, handleResponse);
  if (reqobj !== null) {
    req.end(JSON.stringify(reqobj));
  } else {
    req.end();
  }
}

Context.prototype.setupAccessToken = function (id, secret, callback) {
  var self = this;

  function handleJSON(res, retobj) {
    if (res.statusCode == 200 && retobj !== void(0)) {
      self.accessToken = retobj.access_token;
      self.expiresIn = retobj.expires_in;
      callback(self.accessToken);
    } else {
      callback(null);
    }
  }

  this.requestJSON(null, this.baseURL + 'oauth2/token', null, {
    client_id: id,
    client_secret: secret,
  }, handleJSON);
}

Context.prototype.getAccessToken = function(clientID, clientSecret) {
  return this.accessToken;
}

Context.prototype.adminRequest = function() {
  if (arguments.length >= 3) {
    this._adminRequest(null, arguments[0], arguments[1], arguments[2]);
  } else if (arguments.length == 1 && typeof(arguments[0]) === 'object') {
    var p = arguments[0];
    this._adminRequest(p.method, p.path, p.data, p.callback);
  } else {
    throw new Error('Invalid arugments: ' + util.inspect(arguments));
  }
}

Context.prototype._adminRequest = function(method, path, reqobj, callback) {
  var requrl = this.baseURL + 'apps/' + this.appID;
  if (path !== null && path.length > 0) {
    requrl += '/' + path;
  }
  var headers = {
    'authorization': 'Bearer ' + this.accessToken,
  }
  this.requestJSON(method, requrl, headers, reqobj, callback);
}

module.exports.Context = Context;
