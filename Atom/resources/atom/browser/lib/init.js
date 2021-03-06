// Generated by CoffeeScript 1.7.1
(function() {
  var Readable, app, e, endMark, fs, globalPaths, module, packageJson, packagePath, path, print, searchPaths, startMark, stdin, util, _i, _len,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  module = require('module');

  util = require('util');

  process.type = 'browser';

  process.resourcesPath = path.resolve(process.argv[1], '..', '..', '..', '..');

  process.argv.splice(1, 1);

  startMark = process.argv.indexOf('--atom-shell-switches-start');

  endMark = process.argv.indexOf('--atom-shell-switches-end');

  if (process.platform === 'linux') {
    endMark++;
  }

  process.argv.splice(startMark, endMark - startMark + 1);

  globalPaths = module.globalPaths;

  globalPaths.push(path.join(process.resourcesPath, 'atom', 'browser', 'api', 'lib'));

  require(path.resolve(__dirname, '..', '..', 'common', 'lib', 'init'));

  if (process.platform === 'win32') {
    print = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return process.log(util.format.apply(util, args));
    };
    console.log = console.error = console.warn = print;
    process.stdout.write = process.stderr.write = print;
    Readable = require('stream').Readable;
    stdin = new Readable;
    stdin.push(null);
    process.__defineGetter__('stdin', function() {
      return stdin;
    });
  }

  process.on('uncaughtException', function(error) {
    var message, stack, _ref;
    if (process.listeners('uncaughtException').length > 1) {
      return;
    }
    stack = (_ref = error.stack) != null ? _ref : "" + error.name + ": " + error.message;
    message = "Uncaught Exception:\n" + stack;
    return require('dialog').showErrorBox('A JavaScript error occured in the browser process', message);
  });

  app = require('app');

  app.on('quit', function() {
    return process.emit('exit');
  });

  require('./rpc-server');

  require('./guest-view-manager');

  require('./guest-window-manager');

  packageJson = null;

  searchPaths = ['app', 'app.asar', 'default_app'];

  for (_i = 0, _len = searchPaths.length; _i < _len; _i++) {
    packagePath = searchPaths[_i];
    try {
      packagePath = path.join(process.resourcesPath, packagePath);
      packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json')));
      break;
    } catch (_error) {
      e = _error;
      continue;
    }
  }

  if (packageJson == null) {
    throw new Error("Unable to find a valid app");
  }

  if (packageJson.version != null) {
    app.setVersion(packageJson.version);
  }

  if (packageJson.productName != null) {
    app.setName(packageJson.productName);
  } else if (packageJson.name != null) {
    app.setName(packageJson.name);
  }

  if (packageJson.desktopName != null) {
    app.setDesktopName(packageJson.desktopName);
  } else {
    app.setDesktopName("" + (app.getName()) + ".desktop");
  }

  app.setPath('userData', path.join(app.getPath('appData'), app.getName()));

  app.setPath('userCache', path.join(app.getPath('cache'), app.getName()));

  require('./chrome-extension');

  module._load(path.join(packagePath, packageJson.main), module, true);

}).call(this);
