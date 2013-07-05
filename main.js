// vim:set sts=2 sw=2 tw=0 et:

var config = require('./config.json');
var kii = require('./lib/kii');
var util = require('util');

var ktx = new kii.Context(config.region, config.appID, config.appKey);
ktx.setupAccessToken(config.clientID, config.clientSecret, handleAccessToken);

function handleAccessToken(token) {
  console.log('HERE: ' + token);
  console.log('ktx: ' + util.inspect(ktx));
}
