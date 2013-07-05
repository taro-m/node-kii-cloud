// vim:set sts=2 sw=2 tw=0 et:

var config = require('./config.json');
var kii = require('./lib/kii');
var util = require('util');

var ktx = new kii.Context(config.region, config.appID, config.appKey);
ktx.setupAccessToken(config.clientID, config.clientSecret, handleAccessToken);

function handleAccessToken(token) {
  console.log('ktx: ' + util.inspect(ktx));
  ktx.adminRequest(null, null, handleAppInfo);
}

function handleAppInfo(res, obj) {
  console.log();
  console.log('appInfo: ' + util.inspect(obj));
  ktx.adminRequest('acl', null, handleAppACLInfo);
}

function handleAppACLInfo(res, obj) {
  console.log();
  console.log('handleAppACLInfo: ' + util.inspect(obj));
}
