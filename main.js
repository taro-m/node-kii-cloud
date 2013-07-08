// vim:set sts=2 sw=2 tw=0 et:

var config = require('./config.json');
var kii = require('./lib/kii');
var util = require('util');

var ktx = new kii.Context(config.region, config.appID, config.appKey);
ktx.setupAccessToken(config.clientID, config.clientSecret, checkCurrentACL);
//ktx.setupAccessToken(config.clientID, config.clientSecret, listUsers);
//ktx.setupAccessToken(config.clientID, config.clientSecret, addUser('foo1234'));
//ktx.setupAccessToken(config.clientID, config.clientSecret, addUser('bar1234'));
//ktx.setupAccessToken(config.clientID, config.clientSecret, getAnUser);
//ktx.setupAccessToken(config.clientID, config.clientSecret, addACL(config.userID2));

function checkCurrentACL(token) {
  console.log('ktx: ' + util.inspect(ktx));
  ktx.adminRequest(null, null, handleAppInfo);

  function handleAppInfo(res, obj) {
    console.log();
    console.log('appInfo: ' + util.inspect(obj));
    ktx.adminRequest('acl', null, handleAppACLInfo);
  }

  function handleAppACLInfo(res, obj) {
    console.log();
    console.log('handleAppACLInfo: ' + util.inspect(obj));
    ktx.adminRequest('acl/CREATE_NEW_TOPIC', null, handleACLCreateNewTopic);
  }

  function handleACLCreateNewTopic(res, obj) {
    console.log();
    console.log('handleACL1: ' + util.inspect(obj));
  }
}

function listUsers(token) {
  ktx.adminRequest('users', null, handleUser);

  function handleUser(res, obj) {
    console.log();
    console.log('statusCode:%d obj:%s', res.statusCode, util.inspect(obj));
  }
}

function addUser(loginName) {
  return function (token) {
    var user = {
      loginName: loginName,
      password: '123456',
    }
    ktx.adminRequest('users', user, handleAddUser);

    function handleAddUser(res, obj) {
      console.log();
      console.log('statusCode:%d obj:%s', res.statusCode, util.inspect(obj));
    }
  };
}

function getAnUser(token) {
  ktx.adminRequest('users/LOGIN_NAME:foo1234', null, handleGetAnUser);

  function handleGetAnUser(res, obj) {
    console.log();
    console.log('statusCode:%d', res.statusCode);
    console.log('obj: %s', util.inspect(obj));
  }
}

function addACL(userId) {
  return function(token) {
    var param = {
      method: 'PUT',
      path: 'acl/CREATE_NEW_TOPIC/UserID:' + userId,
      callback: handleAddACL,
    };
    ktx.adminRequest(param);

    function handleAddACL(res, obj) {
      console.log();
      console.log('statusCode:%d', res.statusCode);
      console.log('obj: %s', util.inspect(obj));
    }
  }
}
