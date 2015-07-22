(function() {
  var CSON, CompositeDisposable, Emitter, EmitterMixin, ModuleCache, Package, Q, ScopedProperties, async, deprecate, error, fs, packagesCache, path, _, _ref, _ref1, _ref2,
    __slice = [].slice;

  path = require('path');

  _ = require('underscore-plus');

  async = require('async');

  CSON = require('season');

  fs = require('fs-plus');

  EmitterMixin = require('emissary').Emitter;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  Q = require('q');

  deprecate = require('grim').deprecate;

  ModuleCache = require('./module-cache');

  ScopedProperties = require('./scoped-properties');

  try {
    packagesCache = (_ref1 = (_ref2 = require('../package.json')) != null ? _ref2._atomPackages : void 0) != null ? _ref1 : {};
  } catch (_error) {
    error = _error;
    packagesCache = {};
  }

  module.exports = Package = (function() {
    EmitterMixin.includeInto(Package);

    Package.isBundledPackagePath = function(packagePath) {
      if (atom.packages.devMode) {
        if (!atom.packages.resourcePath.startsWith("" + process.resourcesPath + path.sep)) {
          return false;
        }
      }
      if (this.resourcePathWithTrailingSlash == null) {
        this.resourcePathWithTrailingSlash = "" + atom.packages.resourcePath + path.sep;
      }
      return packagePath != null ? packagePath.startsWith(this.resourcePathWithTrailingSlash) : void 0;
    };

    Package.loadMetadata = function(packagePath, ignoreErrors) {
      var metadata, metadataPath, packageName, _ref3;
      if (ignoreErrors == null) {
        ignoreErrors = false;
      }
      packageName = path.basename(packagePath);
      if (this.isBundledPackagePath(packagePath)) {
        metadata = (_ref3 = packagesCache[packageName]) != null ? _ref3.metadata : void 0;
      }
      if (metadata == null) {
        if (metadataPath = CSON.resolve(path.join(packagePath, 'package'))) {
          try {
            metadata = CSON.readFileSync(metadataPath);
          } catch (_error) {
            error = _error;
            if (!ignoreErrors) {
              throw error;
            }
          }
        }
      }
      if (metadata == null) {
        metadata = {};
      }
      metadata.name = packageName;
      if (metadata.stylesheetMain != null) {
        deprecate("Use the `mainStyleSheet` key instead of `stylesheetMain` in the `package.json` of `" + packageName + "`", {
          packageName: packageName
        });
        metadata.mainStyleSheet = metadata.stylesheetMain;
      }
      if (metadata.stylesheets != null) {
        deprecate("Use the `styleSheets` key instead of `stylesheets` in the `package.json` of `" + packageName + "`", {
          packageName: packageName
        });
        metadata.styleSheets = metadata.stylesheets;
      }
      return metadata;
    };

    Package.prototype.keymaps = null;

    Package.prototype.menus = null;

    Package.prototype.stylesheets = null;

    Package.prototype.stylesheetDisposables = null;

    Package.prototype.grammars = null;

    Package.prototype.settings = null;

    Package.prototype.mainModulePath = null;

    Package.prototype.resolvedMainModulePath = false;

    Package.prototype.mainModule = null;


    /*
    Section: Construction
     */

    function Package(path, metadata) {
      var _ref3, _ref4;
      this.path = path;
      this.metadata = metadata;
      this.emitter = new Emitter;
      if (this.metadata == null) {
        this.metadata = Package.loadMetadata(this.path);
      }
      this.bundledPackage = Package.isBundledPackagePath(this.path);
      this.name = (_ref3 = (_ref4 = this.metadata) != null ? _ref4.name : void 0) != null ? _ref3 : path.basename(this.path);
      ModuleCache.add(this.path, this.metadata);
      this.reset();
    }


    /*
    Section: Event Subscription
     */

    Package.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Package.prototype.on = function(eventName) {
      switch (eventName) {
        case 'deactivated':
          deprecate('Use Package::onDidDeactivate instead');
          break;
        default:
          deprecate('Package::on is deprecated. Use event subscription methods instead.');
      }
      return EmitterMixin.prototype.on.apply(this, arguments);
    };


    /*
    Section: Instance Methods
     */

    Package.prototype.enable = function() {
      return atom.config.removeAtKeyPath('core.disabledPackages', this.name);
    };

    Package.prototype.disable = function() {
      return atom.config.pushAtKeyPath('core.disabledPackages', this.name);
    };

    Package.prototype.isTheme = function() {
      var _ref3;
      return ((_ref3 = this.metadata) != null ? _ref3.theme : void 0) != null;
    };

    Package.prototype.measure = function(key, fn) {
      var startTime, value;
      startTime = Date.now();
      value = fn();
      this[key] = Date.now() - startTime;
      return value;
    };

    Package.prototype.getType = function() {
      return 'atom';
    };

    Package.prototype.getStyleSheetPriority = function() {
      return 0;
    };

    Package.prototype.load = function() {
      this.measure('loadTime', (function(_this) {
        return function() {
          var _ref3;
          try {
            _this.loadKeymaps();
            _this.loadMenus();
            _this.loadStylesheets();
            _this.settingsPromise = _this.loadSettings();
            if (!_this.hasActivationCommands()) {
              return _this.requireMainModule();
            }
          } catch (_error) {
            error = _error;
            return console.warn("Failed to load package named '" + _this.name + "'", (_ref3 = error.stack) != null ? _ref3 : error);
          }
        };
      })(this));
      return this;
    };

    Package.prototype.reset = function() {
      this.stylesheets = [];
      this.keymaps = [];
      this.menus = [];
      this.grammars = [];
      return this.settings = [];
    };

    Package.prototype.activate = function() {
      if (this.grammarsPromise == null) {
        this.grammarsPromise = this.loadGrammars();
      }
      if (this.activationDeferred == null) {
        this.activationDeferred = Q.defer();
        this.measure('activateTime', (function(_this) {
          return function() {
            _this.activateResources();
            if (_this.hasActivationCommands()) {
              return _this.subscribeToActivationCommands();
            } else {
              return _this.activateNow();
            }
          };
        })(this));
      }
      return Q.all([this.grammarsPromise, this.settingsPromise, this.activationDeferred.promise]);
    };

    Package.prototype.activateNow = function() {
      var e, _base, _ref3, _ref4;
      try {
        this.activateConfig();
        this.activateStylesheets();
        if (this.requireMainModule()) {
          if (typeof (_base = this.mainModule).activate === "function") {
            _base.activate((_ref3 = atom.packages.getPackageState(this.name)) != null ? _ref3 : {});
          }
          this.mainActivated = true;
          this.activateServices();
        }
      } catch (_error) {
        e = _error;
        console.warn("Failed to activate package named '" + this.name + "'", e.stack);
      }
      return (_ref4 = this.activationDeferred) != null ? _ref4.resolve() : void 0;
    };

    Package.prototype.activateConfig = function() {
      var _base;
      if (this.configActivated) {
        return;
      }
      this.requireMainModule();
      if (this.mainModule != null) {
        if ((this.mainModule.config != null) && typeof this.mainModule.config === 'object') {
          atom.config.setSchema(this.name, {
            type: 'object',
            properties: this.mainModule.config
          });
        } else if ((this.mainModule.configDefaults != null) && typeof this.mainModule.configDefaults === 'object') {
          deprecate("Use a config schema instead. See the configuration section\nof https://atom.io/docs/latest/creating-a-package and\nhttps://atom.io/docs/api/latest/Config for more details");
          atom.config.setDefaults(this.name, this.mainModule.configDefaults);
        }
        if (typeof (_base = this.mainModule).activateConfig === "function") {
          _base.activateConfig();
        }
      }
      return this.configActivated = true;
    };

    Package.prototype.activateStylesheets = function() {
      var context, match, priority, source, sourcePath, _i, _len, _ref3, _ref4;
      if (this.stylesheetsActivated) {
        return;
      }
      this.stylesheetDisposables = new CompositeDisposable;
      priority = this.getStyleSheetPriority();
      _ref3 = this.stylesheets;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        _ref4 = _ref3[_i], sourcePath = _ref4[0], source = _ref4[1];
        if (match = path.basename(sourcePath).match(/[^.]*\.([^.]*)\./)) {
          context = match[1];
        } else if (this.metadata.theme === 'syntax') {
          context = 'atom-text-editor';
        } else {
          context = void 0;
        }
        this.stylesheetDisposables.add(atom.styles.addStyleSheet(source, {
          sourcePath: sourcePath,
          priority: priority,
          context: context
        }));
      }
      return this.stylesheetsActivated = true;
    };

    Package.prototype.activateResources = function() {
      var grammar, keymapPath, map, menuPath, settings, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref10, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      this.activationDisposables = new CompositeDisposable;
      _ref3 = this.keymaps;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        _ref4 = _ref3[_i], keymapPath = _ref4[0], map = _ref4[1];
        this.activationDisposables.add(atom.keymaps.add(keymapPath, map));
      }
      _ref5 = this.menus;
      for (_j = 0, _len1 = _ref5.length; _j < _len1; _j++) {
        _ref6 = _ref5[_j], menuPath = _ref6[0], map = _ref6[1];
        if (map['context-menu'] != null) {
          this.activationDisposables.add(atom.contextMenu.add(map['context-menu']));
        }
      }
      _ref7 = this.menus;
      for (_k = 0, _len2 = _ref7.length; _k < _len2; _k++) {
        _ref8 = _ref7[_k], menuPath = _ref8[0], map = _ref8[1];
        if (map['menu'] != null) {
          this.activationDisposables.add(atom.menu.add(map['menu']));
        }
      }
      if (!this.grammarsActivated) {
        _ref9 = this.grammars;
        for (_l = 0, _len3 = _ref9.length; _l < _len3; _l++) {
          grammar = _ref9[_l];
          grammar.activate();
        }
        this.grammarsActivated = true;
      }
      _ref10 = this.settings;
      for (_m = 0, _len4 = _ref10.length; _m < _len4; _m++) {
        settings = _ref10[_m];
        settings.activate();
      }
      return this.settingsActivated = true;
    };

    Package.prototype.activateServices = function() {
      var methodName, name, version, versions, _ref3, _ref4, _results;
      _ref3 = this.metadata.providedServices;
      for (name in _ref3) {
        versions = _ref3[name].versions;
        for (version in versions) {
          methodName = versions[version];
          this.activationDisposables.add(atom.packages.serviceHub.provide(name, version, this.mainModule[methodName]()));
        }
      }
      _ref4 = this.metadata.consumedServices;
      _results = [];
      for (name in _ref4) {
        versions = _ref4[name].versions;
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (version in versions) {
            methodName = versions[version];
            _results1.push(this.activationDisposables.add(atom.packages.serviceHub.consume(name, version, this.mainModule[methodName].bind(this.mainModule))));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Package.prototype.loadKeymaps = function() {
      var keymapObject, keymapPath;
      if (this.bundledPackage && (packagesCache[this.name] != null)) {
        return this.keymaps = (function() {
          var _ref3, _results;
          _ref3 = packagesCache[this.name].keymaps;
          _results = [];
          for (keymapPath in _ref3) {
            keymapObject = _ref3[keymapPath];
            _results.push(["" + atom.packages.resourcePath + path.sep + keymapPath, keymapObject]);
          }
          return _results;
        }).call(this);
      } else {
        return this.keymaps = this.getKeymapPaths().map(function(keymapPath) {
          var _ref3;
          return [keymapPath, (_ref3 = CSON.readFileSync(keymapPath)) != null ? _ref3 : {}];
        });
      }
    };

    Package.prototype.loadMenus = function() {
      var menuObject, menuPath;
      if (this.bundledPackage && (packagesCache[this.name] != null)) {
        return this.menus = (function() {
          var _ref3, _results;
          _ref3 = packagesCache[this.name].menus;
          _results = [];
          for (menuPath in _ref3) {
            menuObject = _ref3[menuPath];
            _results.push(["" + atom.packages.resourcePath + path.sep + menuPath, menuObject]);
          }
          return _results;
        }).call(this);
      } else {
        return this.menus = this.getMenuPaths().map(function(menuPath) {
          var _ref3;
          return [menuPath, (_ref3 = CSON.readFileSync(menuPath)) != null ? _ref3 : {}];
        });
      }
    };

    Package.prototype.getKeymapPaths = function() {
      var keymapsDirPath;
      keymapsDirPath = path.join(this.path, 'keymaps');
      if (this.metadata.keymaps) {
        return this.metadata.keymaps.map(function(name) {
          return fs.resolve(keymapsDirPath, name, ['json', 'cson', '']);
        });
      } else {
        return fs.listSync(keymapsDirPath, ['cson', 'json']);
      }
    };

    Package.prototype.getMenuPaths = function() {
      var menusDirPath;
      menusDirPath = path.join(this.path, 'menus');
      if (this.metadata.menus) {
        return this.metadata.menus.map(function(name) {
          return fs.resolve(menusDirPath, name, ['json', 'cson', '']);
        });
      } else {
        return fs.listSync(menusDirPath, ['cson', 'json']);
      }
    };

    Package.prototype.loadStylesheets = function() {
      return this.stylesheets = this.getStylesheetPaths().map(function(stylesheetPath) {
        return [stylesheetPath, atom.themes.loadStylesheet(stylesheetPath, true)];
      });
    };

    Package.prototype.getStylesheetsPath = function() {
      if (fs.isDirectorySync(path.join(this.path, 'stylesheets'))) {
        deprecate("Store package style sheets in the `styles/` directory instead of `stylesheets/` in the `" + this.name + "` package", {
          packageName: this.name
        });
        return path.join(this.path, 'stylesheets');
      } else {
        return path.join(this.path, 'styles');
      }
    };

    Package.prototype.getStylesheetPaths = function() {
      var indexStylesheet, stylesheetDirPath;
      stylesheetDirPath = this.getStylesheetsPath();
      if (this.metadata.mainStyleSheet) {
        return [fs.resolve(this.path, this.metadata.mainStyleSheet)];
      } else if (this.metadata.styleSheets) {
        return this.metadata.styleSheets.map(function(name) {
          return fs.resolve(stylesheetDirPath, name, ['css', 'less', '']);
        });
      } else if (indexStylesheet = fs.resolve(this.path, 'index', ['css', 'less'])) {
        return [indexStylesheet];
      } else {
        return fs.listSync(stylesheetDirPath, ['css', 'less']);
      }
    };

    Package.prototype.loadGrammarsSync = function() {
      var grammar, grammarPath, grammarPaths, grammarsDirPath, _i, _len, _ref3;
      if (this.grammarsLoaded) {
        return;
      }
      grammarsDirPath = path.join(this.path, 'grammars');
      grammarPaths = fs.listSync(grammarsDirPath, ['json', 'cson']);
      for (_i = 0, _len = grammarPaths.length; _i < _len; _i++) {
        grammarPath = grammarPaths[_i];
        try {
          grammar = atom.grammars.readGrammarSync(grammarPath);
          grammar.packageName = this.name;
          this.grammars.push(grammar);
          grammar.activate();
        } catch (_error) {
          error = _error;
          console.warn("Failed to load grammar: " + grammarPath, (_ref3 = error.stack) != null ? _ref3 : error);
        }
      }
      this.grammarsLoaded = true;
      return this.grammarsActivated = true;
    };

    Package.prototype.loadGrammars = function() {
      var deferred, grammarsDirPath, loadGrammar;
      if (this.grammarsLoaded) {
        return Q();
      }
      loadGrammar = (function(_this) {
        return function(grammarPath, callback) {
          return atom.grammars.readGrammar(grammarPath, function(error, grammar) {
            var _ref3;
            if (error != null) {
              console.warn("Failed to load grammar: " + grammarPath, (_ref3 = error.stack) != null ? _ref3 : error);
            } else {
              grammar.packageName = _this.name;
              _this.grammars.push(grammar);
              if (_this.grammarsActivated) {
                grammar.activate();
              }
            }
            return callback();
          });
        };
      })(this);
      deferred = Q.defer();
      grammarsDirPath = path.join(this.path, 'grammars');
      fs.list(grammarsDirPath, ['json', 'cson'], function(error, grammarPaths) {
        if (grammarPaths == null) {
          grammarPaths = [];
        }
        return async.each(grammarPaths, loadGrammar, function() {
          return deferred.resolve();
        });
      });
      return deferred.promise;
    };

    Package.prototype.loadSettings = function() {
      var deferred, loadSettingsFile, settingsDirPath;
      this.settings = [];
      loadSettingsFile = (function(_this) {
        return function(settingsPath, callback) {
          return ScopedProperties.load(settingsPath, function(error, settings) {
            var _ref3;
            if (error != null) {
              console.warn("Failed to load package settings: " + settingsPath, (_ref3 = error.stack) != null ? _ref3 : error);
            } else {
              _this.settings.push(settings);
              if (_this.settingsActivated) {
                settings.activate();
              }
            }
            return callback();
          });
        };
      })(this);
      deferred = Q.defer();
      if (fs.isDirectorySync(path.join(this.path, 'scoped-properties'))) {
        settingsDirPath = path.join(this.path, 'scoped-properties');
        deprecate("Store package settings files in the `settings/` directory instead of `scoped-properties/`", {
          packageName: this.name
        });
      } else {
        settingsDirPath = path.join(this.path, 'settings');
      }
      fs.list(settingsDirPath, ['json', 'cson'], function(error, settingsPaths) {
        if (settingsPaths == null) {
          settingsPaths = [];
        }
        return async.each(settingsPaths, loadSettingsFile, function() {
          return deferred.resolve();
        });
      });
      return deferred.promise;
    };

    Package.prototype.serialize = function() {
      var e, _ref3;
      if (this.mainActivated) {
        try {
          return (_ref3 = this.mainModule) != null ? typeof _ref3.serialize === "function" ? _ref3.serialize() : void 0 : void 0;
        } catch (_error) {
          e = _error;
          return console.error("Error serializing package '" + this.name + "'", e.stack);
        }
      }
    };

    Package.prototype.deactivate = function() {
      var e, _ref3, _ref4, _ref5;
      if ((_ref3 = this.activationDeferred) != null) {
        _ref3.reject();
      }
      this.activationDeferred = null;
      if ((_ref4 = this.activationCommandSubscriptions) != null) {
        _ref4.dispose();
      }
      this.deactivateResources();
      this.deactivateConfig();
      if (this.mainActivated) {
        try {
          if ((_ref5 = this.mainModule) != null) {
            if (typeof _ref5.deactivate === "function") {
              _ref5.deactivate();
            }
          }
        } catch (_error) {
          e = _error;
          console.error("Error deactivating package '" + this.name + "'", e.stack);
        }
      }
      this.emit('deactivated');
      return this.emitter.emit('did-deactivate');
    };

    Package.prototype.deactivateConfig = function() {
      var _ref3;
      if ((_ref3 = this.mainModule) != null) {
        if (typeof _ref3.deactivateConfig === "function") {
          _ref3.deactivateConfig();
        }
      }
      return this.configActivated = false;
    };

    Package.prototype.deactivateResources = function() {
      var grammar, settings, _i, _j, _len, _len1, _ref3, _ref4, _ref5, _ref6;
      _ref3 = this.grammars;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        grammar = _ref3[_i];
        grammar.deactivate();
      }
      _ref4 = this.settings;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        settings = _ref4[_j];
        settings.deactivate();
      }
      if ((_ref5 = this.stylesheetDisposables) != null) {
        _ref5.dispose();
      }
      if ((_ref6 = this.activationDisposables) != null) {
        _ref6.dispose();
      }
      this.stylesheetsActivated = false;
      this.grammarsActivated = false;
      return this.settingsActivated = false;
    };

    Package.prototype.reloadStylesheets = function() {
      var oldSheets, _ref3;
      oldSheets = _.clone(this.stylesheets);
      this.loadStylesheets();
      if ((_ref3 = this.stylesheetDisposables) != null) {
        _ref3.dispose();
      }
      this.stylesheetDisposables = new CompositeDisposable;
      this.stylesheetsActivated = false;
      return this.activateStylesheets();
    };

    Package.prototype.requireMainModule = function() {
      var mainModulePath;
      if (this.mainModule != null) {
        return this.mainModule;
      }
      if (!this.isCompatible()) {
        console.warn("Failed to require the main module of '" + this.name + "' because it requires an incompatible native module.\nRun `apm rebuild` in the package directory to resolve.");
        return;
      }
      mainModulePath = this.getMainModulePath();
      if (fs.isFileSync(mainModulePath)) {
        return this.mainModule = require(mainModulePath);
      }
    };

    Package.prototype.getMainModulePath = function() {
      var mainModulePath;
      if (this.resolvedMainModulePath) {
        return this.mainModulePath;
      }
      this.resolvedMainModulePath = true;
      if (this.bundledPackage && (packagesCache[this.name] != null)) {
        if (packagesCache[this.name].main) {
          return this.mainModulePath = "" + atom.packages.resourcePath + path.sep + packagesCache[this.name].main;
        } else {
          return this.mainModulePath = null;
        }
      } else {
        mainModulePath = this.metadata.main ? path.join(this.path, this.metadata.main) : path.join(this.path, 'index');
        return this.mainModulePath = fs.resolveExtension(mainModulePath, [""].concat(__slice.call(_.keys(require.extensions))));
      }
    };

    Package.prototype.hasActivationCommands = function() {
      var commands, selector, _ref3;
      _ref3 = this.getActivationCommands();
      for (selector in _ref3) {
        commands = _ref3[selector];
        if (commands.length > 0) {
          return true;
        }
      }
      return false;
    };

    Package.prototype.subscribeToActivationCommands = function() {
      var command, commands, selector, _ref3, _results;
      this.activationCommandSubscriptions = new CompositeDisposable;
      _ref3 = this.getActivationCommands();
      _results = [];
      for (selector in _ref3) {
        commands = _ref3[selector];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = commands.length; _i < _len; _i++) {
            command = commands[_i];
            _results1.push((function(_this) {
              return function(selector, command) {
                _this.activationCommandSubscriptions.add(atom.commands.add(selector, command, function() {}));
                return _this.activationCommandSubscriptions.add(atom.commands.onWillDispatch(function(event) {
                  var currentTarget, _results2;
                  if (event.type !== command) {
                    return;
                  }
                  currentTarget = event.target;
                  _results2 = [];
                  while (currentTarget) {
                    if (currentTarget.webkitMatchesSelector(selector)) {
                      _this.activationCommandSubscriptions.dispose();
                      _this.activateNow();
                      break;
                    }
                    _results2.push(currentTarget = currentTarget.parentElement);
                  }
                  return _results2;
                }));
              };
            })(this)(selector, command));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Package.prototype.getActivationCommands = function() {
      var commands, eventName, selector, _base, _base1, _base2, _base3, _i, _len, _ref3, _ref4, _ref5, _ref6;
      if (this.activationCommands != null) {
        return this.activationCommands;
      }
      this.activationCommands = {};
      if (this.metadata.activationCommands != null) {
        _ref3 = this.metadata.activationCommands;
        for (selector in _ref3) {
          commands = _ref3[selector];
          if ((_base = this.activationCommands)[selector] == null) {
            _base[selector] = [];
          }
          if (_.isString(commands)) {
            this.activationCommands[selector].push(commands);
          } else if (_.isArray(commands)) {
            (_ref4 = this.activationCommands[selector]).push.apply(_ref4, commands);
          }
        }
      }
      if (this.metadata.activationEvents != null) {
        deprecate("Use `activationCommands` instead of `activationEvents` in your package.json\nCommands should be grouped by selector as follows:\n```json\n  \"activationCommands\": {\n    \"atom-workspace\": [\"foo:bar\", \"foo:baz\"],\n    \"atom-text-editor\": [\"foo:quux\"]\n  }\n```");
        if (_.isArray(this.metadata.activationEvents)) {
          _ref5 = this.metadata.activationEvents;
          for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
            eventName = _ref5[_i];
            if ((_base1 = this.activationCommands)['atom-workspace'] == null) {
              _base1['atom-workspace'] = [];
            }
            this.activationCommands['atom-workspace'].push(eventName);
          }
        } else if (_.isString(this.metadata.activationEvents)) {
          eventName = this.metadata.activationEvents;
          if ((_base2 = this.activationCommands)['atom-workspace'] == null) {
            _base2['atom-workspace'] = [];
          }
          this.activationCommands['atom-workspace'].push(eventName);
        } else {
          _ref6 = this.metadata.activationEvents;
          for (eventName in _ref6) {
            selector = _ref6[eventName];
            if (selector == null) {
              selector = 'atom-workspace';
            }
            if ((_base3 = this.activationCommands)[selector] == null) {
              _base3[selector] = [];
            }
            this.activationCommands[selector].push(eventName);
          }
        }
      }
      return this.activationCommands;
    };

    Package.prototype.isNativeModule = function(modulePath) {
      try {
        return fs.listSync(path.join(modulePath, 'build', 'Release'), ['.node']).length > 0;
      } catch (_error) {
        error = _error;
        return false;
      }
    };

    Package.prototype.getNativeModuleDependencyPaths = function() {
      var nativeModulePaths, traversePath;
      nativeModulePaths = [];
      traversePath = (function(_this) {
        return function(nodeModulesPath) {
          var modulePath, _i, _len, _ref3, _results;
          try {
            _ref3 = fs.listSync(nodeModulesPath);
            _results = [];
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
              modulePath = _ref3[_i];
              if (_this.isNativeModule(modulePath)) {
                nativeModulePaths.push(modulePath);
              }
              _results.push(traversePath(path.join(modulePath, 'node_modules')));
            }
            return _results;
          } catch (_error) {}
        };
      })(this);
      traversePath(path.join(this.path, 'node_modules'));
      return nativeModulePaths;
    };

    Package.prototype.getIncompatibleNativeModules = function() {
      var incompatibleNativeModules, localStorageKey, nativeModulePath, version, _i, _len, _ref3, _ref4;
      localStorageKey = "installed-packages:" + this.name + ":" + this.metadata.version;
      if (!atom.inDevMode()) {
        try {
          incompatibleNativeModules = ((_ref3 = JSON.parse(global.localStorage.getItem(localStorageKey))) != null ? _ref3 : {}).incompatibleNativeModules;
        } catch (_error) {}
        if (incompatibleNativeModules != null) {
          return incompatibleNativeModules;
        }
      }
      incompatibleNativeModules = [];
      _ref4 = this.getNativeModuleDependencyPaths();
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        nativeModulePath = _ref4[_i];
        try {
          require(nativeModulePath);
        } catch (_error) {
          error = _error;
          try {
            version = require("" + nativeModulePath + "/package.json").version;
          } catch (_error) {}
          incompatibleNativeModules.push({
            path: nativeModulePath,
            name: path.basename(nativeModulePath),
            version: version,
            error: error.message
          });
        }
      }
      global.localStorage.setItem(localStorageKey, JSON.stringify({
        incompatibleNativeModules: incompatibleNativeModules
      }));
      return incompatibleNativeModules;
    };

    Package.prototype.isCompatible = function() {
      if (this.compatible != null) {
        return this.compatible;
      }
      if (this.path.indexOf(path.join(atom.packages.resourcePath, 'node_modules') + path.sep) === 0) {
        return this.compatible = true;
      } else if (this.getMainModulePath()) {
        this.incompatibleModules = this.getIncompatibleNativeModules();
        return this.compatible = this.incompatibleModules.length === 0;
      } else {
        return this.compatible = true;
      }
    };

    return Package;

  })();

}).call(this);
