(function() {
  var config, configureRequest, loadNpm, npm, request;

  npm = require('npm');

  request = require('npm/node_modules/request');

  config = require('./apm');

  loadNpm = function(callback) {
    var npmOptions;
    npmOptions = {
      userconfig: config.getUserConfigPath(),
      globalconfig: config.getGlobalConfigPath()
    };
    return npm.load(npmOptions, callback);
  };

  configureRequest = function(requestOptions, callback) {
    return loadNpm(function() {
      var userAgent, _base, _ref;
      if (requestOptions.proxy == null) {
        requestOptions.proxy = npm.config.get('https-proxy') || npm.config.get('proxy');
      }
      if (requestOptions.strictSSL == null) {
        requestOptions.strictSSL = npm.config.get('strict-ssl');
      }
      userAgent = (_ref = npm.config.get('user-agent')) != null ? _ref : "AtomApm/" + (require('../package.json').version);
      if (requestOptions.headers == null) {
        requestOptions.headers = {};
      }
      if ((_base = requestOptions.headers)['User-Agent'] == null) {
        _base['User-Agent'] = userAgent;
      }
      return callback();
    });
  };

  module.exports = {
    get: function(requestOptions, callback) {
      return configureRequest(requestOptions, function() {
        return request.get(requestOptions, callback);
      });
    },
    del: function(requestOptions, callback) {
      return configureRequest(requestOptions, function() {
        return request.del(requestOptions, callback);
      });
    },
    post: function(requestOptions, callback) {
      return configureRequest(requestOptions, function() {
        return request.post(requestOptions, callback);
      });
    },
    createReadStream: function(requestOptions, callback) {
      return configureRequest(requestOptions, function() {
        return callback(request.get(requestOptions));
      });
    },
    getErrorMessage: function(response, body) {
      var _ref, _ref1;
      if ((response != null ? response.statusCode : void 0) === 503) {
        return 'atom.io is temporarily unavailable, please try again later.';
      } else {
        return (_ref = (_ref1 = body != null ? body.message : void 0) != null ? _ref1 : body != null ? body.error : void 0) != null ? _ref : body;
      }
    },
    debug: function(debug) {
      return request.debug = debug;
    }
  };

}).call(this);
