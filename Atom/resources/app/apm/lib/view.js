(function() {
  var Command, View, config, optimist, request, tree, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  optimist = require('optimist');

  Command = require('./command');

  config = require('./apm');

  request = require('./request');

  tree = require('./tree');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.commandNames = ['view', 'show'];

    View.prototype.parseOptions = function(argv) {
      var options;
      options = optimist(argv);
      options.usage("\nUsage: apm view <package_name>\n\nView information about a package/theme in the atom.io registry.");
      options.alias('h', 'help').describe('help', 'Print this usage message');
      return options.boolean('json').describe('json', 'Output featured packages as JSON array');
    };

    View.prototype.getRepository = function(pack) {
      var repository, _ref, _ref1;
      if (repository = (_ref = (_ref1 = pack.repository) != null ? _ref1.url : void 0) != null ? _ref : pack.repository) {
        return repository.replace(/\.git$/, '');
      }
    };

    View.prototype.getPackage = function(packageName, callback) {
      var requestSettings;
      requestSettings = {
        url: "" + (config.getAtomPackagesUrl()) + "/" + packageName,
        json: true
      };
      return request.get(requestSettings, function(error, response, body) {
        var downloads, message, metadata, pack, readme, repository, stargazers_count, _ref, _ref1;
        if (body == null) {
          body = {};
        }
        if (error != null) {
          return callback(error);
        } else if (response.statusCode === 200) {
          metadata = body.metadata, readme = body.readme, repository = body.repository, downloads = body.downloads, stargazers_count = body.stargazers_count;
          pack = _.extend({}, metadata, {
            readme: readme,
            downloads: downloads,
            stargazers_count: stargazers_count
          });
          return callback(null, pack);
        } else {
          message = (_ref = (_ref1 = body.message) != null ? _ref1 : body.error) != null ? _ref : body;
          return callback("Requesting package failed: " + message);
        }
      });
    };

    View.prototype.run = function(options) {
      var callback, packageName;
      callback = options.callback;
      options = this.parseOptions(options.commandArgs);
      packageName = options.argv._[0];
      if (!packageName) {
        callback("Missing required package name");
        return;
      }
      return this.getPackage(packageName, (function(_this) {
        return function(error, pack) {
          var items, repository;
          if (error != null) {
            callback(error);
            return;
          }
          if (options.argv.json) {
            console.log(JSON.stringify(pack, null, 2));
          } else {
            console.log("" + pack.name.cyan);
            items = [];
            if (pack.version) {
              items.push(pack.version.yellow);
            }
            if (repository = _this.getRepository(pack)) {
              items.push(repository.underline);
            }
            if (pack.description) {
              items.push(pack.description.replace(/\s+/g, ' '));
            }
            if (pack.downloads >= 0) {
              items.push(_.pluralize(pack.downloads, 'download'));
            }
            if (pack.stargazers_count >= 0) {
              items.push(_.pluralize(pack.stargazers_count, 'star'));
            }
            tree(items);
            console.log();
            console.log("Run `apm install " + pack.name + "` to install this package.");
            console.log();
          }
          return callback();
        };
      })(this));
    };

    return View;

  })(Command);

}).call(this);
