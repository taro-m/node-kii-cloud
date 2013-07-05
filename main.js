// vim:set sts=2 sw=2 tw=0 et:

var config = require('./config.json');
var kii = require('./lib/kii');

var ctx = new kii.Context(config.region, config.appID, config.appKey);
ctx.setupAccessToken(config.clientID, config.clientSecret, handleAccessToken);

function handleAccessToken(token) {
  console.log('HERE: ' + token);
}
