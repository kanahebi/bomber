(function() {
  var Emitter, EmitterMixin, Grim, Package, PackageManager, Q, ServiceHub, ThemePackage, fs, path, _,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  _ = require('underscore-plus');

  EmitterMixin = require('emissary').Emitter;

  Emitter = require('event-kit').Emitter;

  fs = require('fs-plus');

  Q = require('q');

  Grim = require('grim');

  ServiceHub = require('service-hub');

  Package = require('./package');

  ThemePackage = require('./theme-package');

  module.exports = PackageManager = (function() {
    EmitterMixin.includeInto(PackageManager);

    function PackageManager(_arg) {
      var configDirPath, safeMode;
      configDirPath = _arg.configDirPath, this.devMode = _arg.devMode, safeMode = _arg.safeMode, this.resourcePath = _arg.resourcePath;
      this.emitter = new Emitter;
      this.packageDirPaths = [];
      if (!safeMode) {
        if (this.devMode) {
          this.packageDirPaths.push(path.join(configDirPath, "dev", "packages"));
        }
        this.packageDirPaths.push(path.join(configDirPath, "packages"));
      }
      this.loadedPackages = {};
      this.activePackages = {};
      this.packageStates = {};
      this.serviceHub = new ServiceHub;
      this.packageActivators = [];
      this.registerPackageActivator(this, ['atom', 'textmate']);
    }


    /*
    Section: Event Subscription
     */

    PackageManager.prototype.onDidLoadInitialPackages = function(callback) {
      this.emitter.on('did-load-initial-packages', callback);
      return this.emitter.on('did-load-all', callback);
    };

    PackageManager.prototype.onDidLoadAll = function(callback) {
      Grim.deprecate("Use `::onDidLoadInitialPackages` instead.");
      return this.onDidLoadInitialPackages(callback);
    };

    PackageManager.prototype.onDidActivateInitialPackages = function(callback) {
      this.emitter.on('did-activate-initial-packages', callback);
      return this.emitter.on('did-activate-all', callback);
    };

    PackageManager.prototype.onDidActivateAll = function(callback) {
      Grim.deprecate("Use `::onDidActivateInitialPackages` instead.");
      return this.onDidActivateInitialPackages(callback);
    };

    PackageManager.prototype.onDidActivatePackage = function(callback) {
      return this.emitter.on('did-activate-package', callback);
    };

    PackageManager.prototype.onDidDeactivatePackage = function(callback) {
      return this.emitter.on('did-deactivate-package', callback);
    };

    PackageManager.prototype.onDidLoadPackage = function(callback) {
      return this.emitter.on('did-load-package', callback);
    };

    PackageManager.prototype.onDidUnloadPackage = function(callback) {
      return this.emitter.on('did-unload-package', callback);
    };

    PackageManager.prototype.on = function(eventName) {
      switch (eventName) {
        case 'loaded':
          Grim.deprecate('Use PackageManager::onDidLoadInitialPackages instead');
          break;
        case 'activated':
          Grim.deprecate('Use PackageManager::onDidActivateInitialPackages instead');
          break;
        default:
          Grim.deprecate('PackageManager::on is deprecated. Use event subscription methods instead.');
      }
      return EmitterMixin.prototype.on.apply(this, arguments);
    };


    /*
    Section: Package system data
     */

    PackageManager.prototype.getApmPath = function() {
      var apmRoot, commandName;
      if (this.apmPath != null) {
        return this.apmPath;
      }
      commandName = 'apm';
      if (process.platform === 'win32') {
        commandName += '.cmd';
      }
      apmRoot = path.resolve(__dirname, '..', 'apm');
      this.apmPath = path.join(apmRoot, 'bin', commandName);
      if (!fs.isFileSync(this.apmPath)) {
        this.apmPath = path.join(apmRoot, 'node_modules', 'atom-package-manager', 'bin', commandName);
      }
      return this.apmPath;
    };

    PackageManager.prototype.getPackageDirPaths = function() {
      return _.clone(this.packageDirPaths);
    };


    /*
    Section: General package data
     */

    PackageManager.prototype.resolvePackagePath = function(name) {
      var packagePath;
      if (fs.isDirectorySync(name)) {
        return name;
      }
      packagePath = fs.resolve.apply(fs, __slice.call(this.packageDirPaths).concat([name]));
      if (fs.isDirectorySync(packagePath)) {
        return packagePath;
      }
      packagePath = path.join(this.resourcePath, 'node_modules', name);
      if (this.hasAtomEngine(packagePath)) {
        return packagePath;
      }
    };

    PackageManager.prototype.isBundledPackage = function(name) {
      return this.getPackageDependencies().hasOwnProperty(name);
    };


    /*
    Section: Enabling and disabling packages
     */

    PackageManager.prototype.enablePackage = function(name) {
      var pack;
      pack = this.loadPackage(name);
      if (pack != null) {
        pack.enable();
      }
      return pack;
    };

    PackageManager.prototype.disablePackage = function(name) {
      var pack;
      pack = this.loadPackage(name);
      if (pack != null) {
        pack.disable();
      }
      return pack;
    };

    PackageManager.prototype.isPackageDisabled = function(name) {
      var _ref;
      return _.include((_ref = atom.config.get('core.disabledPackages')) != null ? _ref : [], name);
    };


    /*
    Section: Accessing active packages
     */

    PackageManager.prototype.getActivePackages = function() {
      return _.values(this.activePackages);
    };

    PackageManager.prototype.getActivePackage = function(name) {
      return this.activePackages[name];
    };

    PackageManager.prototype.isPackageActive = function(name) {
      return this.getActivePackage(name) != null;
    };


    /*
    Section: Accessing loaded packages
     */

    PackageManager.prototype.getLoadedPackages = function() {
      return _.values(this.loadedPackages);
    };

    PackageManager.prototype.getLoadedPackagesForTypes = function(types) {
      var pack, _i, _len, _ref, _ref1, _results;
      _ref = this.getLoadedPackages();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pack = _ref[_i];
        if (_ref1 = pack.getType(), __indexOf.call(types, _ref1) >= 0) {
          _results.push(pack);
        }
      }
      return _results;
    };

    PackageManager.prototype.getLoadedPackage = function(name) {
      return this.loadedPackages[name];
    };

    PackageManager.prototype.isPackageLoaded = function(name) {
      return this.getLoadedPackage(name) != null;
    };


    /*
    Section: Accessing available packages
     */

    PackageManager.prototype.getAvailablePackagePaths = function() {
      var packageDirPath, packageName, packagePath, packagePaths, packageVersion, packagesPath, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      packagePaths = [];
      _ref = this.packageDirPaths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        packageDirPath = _ref[_i];
        _ref1 = fs.listSync(packageDirPath);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          packagePath = _ref1[_j];
          if (fs.isDirectorySync(packagePath)) {
            packagePaths.push(packagePath);
          }
        }
      }
      packagesPath = path.join(this.resourcePath, 'node_modules');
      _ref2 = this.getPackageDependencies();
      for (packageName in _ref2) {
        packageVersion = _ref2[packageName];
        packagePath = path.join(packagesPath, packageName);
        if (fs.isDirectorySync(packagePath)) {
          packagePaths.push(packagePath);
        }
      }
      return _.uniq(packagePaths);
    };

    PackageManager.prototype.getAvailablePackageNames = function() {
      return _.uniq(_.map(this.getAvailablePackagePaths(), function(packagePath) {
        return path.basename(packagePath);
      }));
    };

    PackageManager.prototype.getAvailablePackageMetadata = function() {
      var metadata, name, packagePath, packages, _i, _len, _ref, _ref1, _ref2;
      packages = [];
      _ref = this.getAvailablePackagePaths();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        packagePath = _ref[_i];
        name = path.basename(packagePath);
        metadata = (_ref1 = (_ref2 = this.getLoadedPackage(name)) != null ? _ref2.metadata : void 0) != null ? _ref1 : Package.loadMetadata(packagePath, true);
        packages.push(metadata);
      }
      return packages;
    };


    /*
    Section: Private
     */

    PackageManager.prototype.getPackageState = function(name) {
      return this.packageStates[name];
    };

    PackageManager.prototype.setPackageState = function(name, state) {
      return this.packageStates[name] = state;
    };

    PackageManager.prototype.getPackageDependencies = function() {
      var metadataPath, _ref;
      if (this.packageDependencies == null) {
        try {
          metadataPath = path.join(this.resourcePath, 'package.json');
          this.packageDependencies = ((_ref = JSON.parse(fs.readFileSync(metadataPath))) != null ? _ref : {}).packageDependencies;
        } catch (_error) {}
        if (this.packageDependencies == null) {
          this.packageDependencies = {};
        }
      }
      return this.packageDependencies;
    };

    PackageManager.prototype.hasAtomEngine = function(packagePath) {
      var metadata, _ref;
      metadata = Package.loadMetadata(packagePath, true);
      return (metadata != null ? (_ref = metadata.engines) != null ? _ref.atom : void 0 : void 0) != null;
    };

    PackageManager.prototype.unobserveDisabledPackages = function() {
      var _ref;
      if ((_ref = this.disabledPackagesSubscription) != null) {
        _ref.dispose();
      }
      return this.disabledPackagesSubscription = null;
    };

    PackageManager.prototype.observeDisabledPackages = function() {
      return this.disabledPackagesSubscription != null ? this.disabledPackagesSubscription : this.disabledPackagesSubscription = atom.config.onDidChange('core.disabledPackages', (function(_this) {
        return function(_arg) {
          var newValue, oldValue, packageName, packagesToDisable, packagesToEnable, _i, _j, _len, _len1;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          packagesToEnable = _.difference(oldValue, newValue);
          packagesToDisable = _.difference(newValue, oldValue);
          for (_i = 0, _len = packagesToDisable.length; _i < _len; _i++) {
            packageName = packagesToDisable[_i];
            if (_this.getActivePackage(packageName)) {
              _this.deactivatePackage(packageName);
            }
          }
          for (_j = 0, _len1 = packagesToEnable.length; _j < _len1; _j++) {
            packageName = packagesToEnable[_j];
            _this.activatePackage(packageName);
          }
          return null;
        };
      })(this));
    };

    PackageManager.prototype.loadPackages = function() {
      var packagePath, packagePaths, _i, _len;
      require('../exports/atom');
      packagePaths = this.getAvailablePackagePaths();
      packagePaths = packagePaths.filter((function(_this) {
        return function(packagePath) {
          return !_this.isPackageDisabled(path.basename(packagePath));
        };
      })(this));
      packagePaths = _.uniq(packagePaths, function(packagePath) {
        return path.basename(packagePath);
      });
      for (_i = 0, _len = packagePaths.length; _i < _len; _i++) {
        packagePath = packagePaths[_i];
        this.loadPackage(packagePath);
      }
      this.emit('loaded');
      return this.emitter.emit('did-load-initial-packages');
    };

    PackageManager.prototype.loadPackage = function(nameOrPath) {
      var error, metadata, name, pack, packagePath, _ref, _ref1;
      if (pack = this.getLoadedPackage(nameOrPath)) {
        return pack;
      }
      if (packagePath = this.resolvePackagePath(nameOrPath)) {
        name = path.basename(nameOrPath);
        if (pack = this.getLoadedPackage(name)) {
          return pack;
        }
        try {
          metadata = (_ref = Package.loadMetadata(packagePath)) != null ? _ref : {};
          if (metadata.theme) {
            pack = new ThemePackage(packagePath, metadata);
          } else {
            pack = new Package(packagePath, metadata);
          }
          pack.load();
          this.loadedPackages[pack.name] = pack;
          this.emitter.emit('did-load-package', pack);
          return pack;
        } catch (_error) {
          error = _error;
          console.warn("Failed to load package.json '" + (path.basename(packagePath)) + "'", (_ref1 = error.stack) != null ? _ref1 : error);
        }
      } else {
        console.warn("Could not resolve '" + nameOrPath + "' to a package path");
      }
      return null;
    };

    PackageManager.prototype.unloadPackages = function() {
      var name, _i, _len, _ref;
      _ref = _.keys(this.loadedPackages);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.unloadPackage(name);
      }
      return null;
    };

    PackageManager.prototype.unloadPackage = function(name) {
      var pack;
      if (this.isPackageActive(name)) {
        throw new Error("Tried to unload active package '" + name + "'");
      }
      if (pack = this.getLoadedPackage(name)) {
        delete this.loadedPackages[pack.name];
        return this.emitter.emit('did-unload-package', pack);
      } else {
        throw new Error("No loaded package for name '" + name + "'");
      }
    };

    PackageManager.prototype.activate = function() {
      var activator, packages, promises, types, _i, _len, _ref, _ref1;
      promises = [];
      _ref = this.packageActivators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], activator = _ref1[0], types = _ref1[1];
        packages = this.getLoadedPackagesForTypes(types);
        promises = promises.concat(activator.activatePackages(packages));
      }
      return Q.all(promises).then((function(_this) {
        return function() {
          _this.emit('activated');
          return _this.emitter.emit('did-activate-initial-packages');
        };
      })(this));
    };

    PackageManager.prototype.registerPackageActivator = function(activator, types) {
      return this.packageActivators.push([activator, types]);
    };

    PackageManager.prototype.activatePackages = function(packages) {
      var promises;
      promises = [];
      atom.config.transact((function(_this) {
        return function() {
          var pack, promise, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = packages.length; _i < _len; _i++) {
            pack = packages[_i];
            promise = _this.activatePackage(pack.name);
            if (!pack.hasActivationCommands()) {
              _results.push(promises.push(promise));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      this.observeDisabledPackages();
      return promises;
    };

    PackageManager.prototype.activatePackage = function(name) {
      var pack;
      if (pack = this.getActivePackage(name)) {
        return Q(pack);
      } else if (pack = this.loadPackage(name)) {
        return pack.activate().then((function(_this) {
          return function() {
            _this.activePackages[pack.name] = pack;
            _this.emitter.emit('did-activate-package', pack);
            return pack;
          };
        })(this));
      } else {
        return Q.reject(new Error("Failed to load package '" + name + "'"));
      }
    };

    PackageManager.prototype.deactivatePackages = function() {
      atom.config.transact((function(_this) {
        return function() {
          var pack, _i, _len, _ref, _results;
          _ref = _this.getLoadedPackages();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pack = _ref[_i];
            _results.push(_this.deactivatePackage(pack.name));
          }
          return _results;
        };
      })(this));
      return this.unobserveDisabledPackages();
    };

    PackageManager.prototype.deactivatePackage = function(name) {
      var pack, state;
      pack = this.getLoadedPackage(name);
      if (this.isPackageActive(name)) {
        if (state = typeof pack.serialize === "function" ? pack.serialize() : void 0) {
          this.setPackageState(pack.name, state);
        }
      }
      pack.deactivate();
      delete this.activePackages[pack.name];
      return this.emitter.emit('did-deactivate-package', pack);
    };

    return PackageManager;

  })();

}).call(this);
