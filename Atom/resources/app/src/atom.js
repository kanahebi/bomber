(function() {
  var $, Atom, Emitter, Model, StylesElement, WindowEventHandler, convertLine, convertStackTrace, crypto, deprecate, fs, ipc, os, path, remote, shell, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  crypto = require('crypto');

  ipc = require('ipc');

  os = require('os');

  path = require('path');

  remote = require('remote');

  shell = require('shell');

  _ = require('underscore-plus');

  deprecate = require('grim').deprecate;

  Emitter = require('event-kit').Emitter;

  Model = require('theorist').Model;

  fs = require('fs-plus');

  _ref = require('coffeestack'), convertStackTrace = _ref.convertStackTrace, convertLine = _ref.convertLine;

  $ = require('./space-pen-extensions').$;

  WindowEventHandler = require('./window-event-handler');

  StylesElement = require('./styles-element');

  module.exports = Atom = (function(_super) {
    __extends(Atom, _super);

    Atom.version = 1;

    Atom.loadOrCreate = function(mode) {
      var atom, serviceHubDeprecationMessage, startTime, workspaceViewDeprecationMessage, _ref1;
      startTime = Date.now();
      atom = (_ref1 = this.deserialize(this.loadState(mode))) != null ? _ref1 : new this({
        mode: mode,
        version: this.version
      });
      atom.deserializeTimings.atom = Date.now() - startTime;
      workspaceViewDeprecationMessage = "atom.workspaceView is no longer available.\nIn most cases you will not need the view. See the Workspace docs for\nalternatives: https://atom.io/docs/api/latest/Workspace.\nIf you do need the view, please use `atom.views.getView(atom.workspace)`,\nwhich returns an HTMLElement.";
      serviceHubDeprecationMessage = "atom.services is no longer available. To register service providers and\nconsumers, use the `providedServices` and `consumedServices` fields in\nyour package's package.json.";
      Object.defineProperty(atom, 'workspaceView', {
        get: function() {
          deprecate(workspaceViewDeprecationMessage);
          return atom.__workspaceView;
        },
        set: function(newValue) {
          deprecate(workspaceViewDeprecationMessage);
          return atom.__workspaceView = newValue;
        }
      });
      Object.defineProperty(atom, 'services', {
        get: function() {
          deprecate(serviceHubDeprecationMessage);
          return atom.packages.serviceHub;
        },
        set: function(newValue) {
          deprecate(serviceHubDeprecationMessage);
          return atom.packages.serviceHub = newValue;
        }
      });
      return atom;
    };

    Atom.deserialize = function(state) {
      if ((state != null ? state.version : void 0) === this.version) {
        return new this(state);
      }
    };

    Atom.loadState = function(mode) {
      var error, statePath, stateString;
      statePath = this.getStatePath(this.getLoadSettings().initialPaths, mode);
      if (fs.existsSync(statePath)) {
        try {
          stateString = fs.readFileSync(statePath, 'utf8');
        } catch (_error) {
          error = _error;
          console.warn("Error reading window state: " + statePath, error.stack, error);
        }
      } else {
        stateString = this.getLoadSettings().windowState;
      }
      try {
        if (stateString != null) {
          return JSON.parse(stateString);
        }
      } catch (_error) {
        error = _error;
        return console.warn("Error parsing window state: " + statePath + " " + error.stack, error);
      }
    };

    Atom.getStatePath = function(paths, mode) {
      var filename, sha1;
      switch (mode) {
        case 'spec':
          filename = 'spec';
          break;
        case 'editor':
          if ((paths != null ? paths.length : void 0) > 0) {
            sha1 = crypto.createHash('sha1').update(paths.slice().sort().join("\n")).digest('hex');
            filename = "editor-" + sha1;
          }
      }
      if (filename) {
        return path.join(this.getStorageDirPath(), filename);
      } else {
        return null;
      }
    };

    Atom.getConfigDirPath = function() {
      return this.configDirPath != null ? this.configDirPath : this.configDirPath = process.env.ATOM_HOME;
    };

    Atom.getStorageDirPath = function() {
      return this.storageDirPath != null ? this.storageDirPath : this.storageDirPath = path.join(this.getConfigDirPath(), 'storage');
    };

    Atom.getLoadSettings = function() {
      var cloned;
      if (this.loadSettings == null) {
        this.loadSettings = JSON.parse(decodeURIComponent(location.search.substr(14)));
      }
      cloned = _.deepClone(this.loadSettings);
      cloned.__defineGetter__('windowState', (function(_this) {
        return function() {
          return _this.getCurrentWindow().loadSettings.windowState;
        };
      })(this));
      cloned.__defineSetter__('windowState', (function(_this) {
        return function(value) {
          return _this.getCurrentWindow().loadSettings.windowState = value;
        };
      })(this));
      return cloned;
    };

    Atom.getCurrentWindow = function() {
      return remote.getCurrentWindow();
    };

    Atom.prototype.workspaceViewParentSelector = 'body';

    Atom.prototype.lastUncaughtError = null;


    /*
    Section: Properties
     */

    Atom.prototype.commands = null;

    Atom.prototype.config = null;

    Atom.prototype.clipboard = null;

    Atom.prototype.contextMenu = null;

    Atom.prototype.menu = null;

    Atom.prototype.keymaps = null;

    Atom.prototype.tooltips = null;

    Atom.prototype.notifications = null;

    Atom.prototype.project = null;

    Atom.prototype.grammars = null;

    Atom.prototype.packages = null;

    Atom.prototype.themes = null;

    Atom.prototype.styles = null;

    Atom.prototype.deserializers = null;

    Atom.prototype.views = null;

    Atom.prototype.workspace = null;


    /*
    Section: Construction and Destruction
     */

    function Atom(state) {
      var DeserializerManager;
      this.state = state;
      this.emitter = new Emitter;
      this.mode = this.state.mode;
      DeserializerManager = require('./deserializer-manager');
      this.deserializers = new DeserializerManager();
      this.deserializeTimings = {};
    }

    Atom.prototype.initialize = function() {
      var Clipboard, CommandRegistry, Config, ContextMenuManager, DisplayBuffer, GrammarRegistry, KeymapManager, MenuManager, NotificationManager, PackageManager, Project, StyleManager, TextBuffer, TextEditor, ThemeManager, TokenizedBuffer, TooltipManager, ViewRegistry, configDirPath, devMode, exportsPath, resourcePath, safeMode, sourceMapCache, _base, _ref1, _ref2, _ref3;
      if (!(this.inDevMode() || this.inSpecMode())) {
        require('grim').deprecate = function() {};
      }
      sourceMapCache = {};
      window.onerror = (function(_this) {
        return function() {
          var column, convertedLine, eventObject, line, message, openDevTools, originalError, url, _ref1;
          _this.lastUncaughtError = Array.prototype.slice.call(arguments);
          _ref1 = _this.lastUncaughtError, message = _ref1[0], url = _ref1[1], line = _ref1[2], column = _ref1[3], originalError = _ref1[4];
          convertedLine = convertLine(url, line, column, sourceMapCache);
          if (convertedLine != null) {
            line = convertedLine.line, column = convertedLine.column;
          }
          if (originalError) {
            originalError.stack = convertStackTrace(originalError.stack, sourceMapCache);
          }
          eventObject = {
            message: message,
            url: url,
            line: line,
            column: column,
            originalError: originalError
          };
          openDevTools = true;
          eventObject.preventDefault = function() {
            return openDevTools = false;
          };
          _this.emitter.emit('will-throw-error', eventObject);
          if (openDevTools) {
            _this.openDevTools();
            _this.executeJavaScriptInDevTools('InspectorFrontendAPI.showConsole()');
          }
          _this.emit.apply(_this, ['uncaught-error'].concat(__slice.call(arguments)));
          return _this.emitter.emit('did-throw-error', {
            message: message,
            url: url,
            line: line,
            column: column,
            originalError: originalError
          });
        };
      })(this);
      this.unsubscribe();
      this.setBodyPlatformClass();
      this.loadTime = null;
      Config = require('./config');
      KeymapManager = require('./keymap-extensions');
      ViewRegistry = require('./view-registry');
      CommandRegistry = require('./command-registry');
      TooltipManager = require('./tooltip-manager');
      NotificationManager = require('./notification-manager');
      PackageManager = require('./package-manager');
      Clipboard = require('./clipboard');
      GrammarRegistry = require('./grammar-registry');
      ThemeManager = require('./theme-manager');
      StyleManager = require('./style-manager');
      ContextMenuManager = require('./context-menu-manager');
      MenuManager = require('./menu-manager');
      _ref1 = this.getLoadSettings(), devMode = _ref1.devMode, safeMode = _ref1.safeMode, resourcePath = _ref1.resourcePath;
      configDirPath = this.getConfigDirPath();
      exportsPath = path.join(resourcePath, 'exports');
      require('module').globalPaths.push(exportsPath);
      process.env.NODE_PATH = exportsPath;
      if (!devMode) {
        if ((_base = process.env).NODE_ENV == null) {
          _base.NODE_ENV = 'production';
        }
      }
      this.config = new Config({
        configDirPath: configDirPath,
        resourcePath: resourcePath
      });
      this.keymaps = new KeymapManager({
        configDirPath: configDirPath,
        resourcePath: resourcePath
      });
      this.keymap = this.keymaps;
      this.keymaps.subscribeToFileReadFailure();
      this.tooltips = new TooltipManager;
      this.notifications = new NotificationManager;
      this.commands = new CommandRegistry;
      this.views = new ViewRegistry;
      this.packages = new PackageManager({
        devMode: devMode,
        configDirPath: configDirPath,
        resourcePath: resourcePath,
        safeMode: safeMode
      });
      this.styles = new StyleManager;
      document.head.appendChild(new StylesElement);
      this.themes = new ThemeManager({
        packageManager: this.packages,
        configDirPath: configDirPath,
        resourcePath: resourcePath,
        safeMode: safeMode
      });
      this.contextMenu = new ContextMenuManager({
        resourcePath: resourcePath,
        devMode: devMode
      });
      this.menu = new MenuManager({
        resourcePath: resourcePath
      });
      this.clipboard = new Clipboard();
      this.grammars = (_ref2 = this.deserializers.deserialize((_ref3 = this.state.grammars) != null ? _ref3 : this.state.syntax)) != null ? _ref2 : new GrammarRegistry();
      Object.defineProperty(this, 'syntax', {
        get: function() {
          deprecate("The atom.syntax global is deprecated. Use atom.grammars instead.");
          return this.grammars;
        }
      });
      this.subscribe(this.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return _this.watchThemes();
        };
      })(this)));
      Project = require('./project');
      TextBuffer = require('text-buffer');
      this.deserializers.add(TextBuffer);
      TokenizedBuffer = require('./tokenized-buffer');
      DisplayBuffer = require('./display-buffer');
      TextEditor = require('./text-editor');
      return this.windowEventHandler = new WindowEventHandler;
    };


    /*
    Section: Event Subscription
     */

    Atom.prototype.onDidBeep = function(callback) {
      return this.emitter.on('did-beep', callback);
    };

    Atom.prototype.onWillThrowError = function(callback) {
      return this.emitter.on('will-throw-error', callback);
    };

    Atom.prototype.onDidThrowError = function(callback) {
      return this.emitter.on('did-throw-error', callback);
    };


    /*
    Section: Atom Details
     */

    Atom.prototype.inDevMode = function() {
      return this.getLoadSettings().devMode;
    };

    Atom.prototype.inSafeMode = function() {
      return this.getLoadSettings().safeMode;
    };

    Atom.prototype.inSpecMode = function() {
      return this.getLoadSettings().isSpec;
    };

    Atom.prototype.getVersion = function() {
      return this.appVersion != null ? this.appVersion : this.appVersion = this.getLoadSettings().appVersion;
    };

    Atom.prototype.isReleasedVersion = function() {
      return !/\w{7}/.test(this.getVersion());
    };

    Atom.prototype.getConfigDirPath = function() {
      return this.constructor.getConfigDirPath();
    };

    Atom.prototype.getWindowLoadTime = function() {
      return this.loadTime;
    };

    Atom.prototype.getLoadSettings = function() {
      return this.constructor.getLoadSettings();
    };


    /*
    Section: Managing The Atom Window
     */

    Atom.prototype.open = function(options) {
      return ipc.send('open', options);
    };

    Atom.prototype.pickFolder = function(callback) {
      var responseChannel;
      responseChannel = "atom-pick-folder-response";
      ipc.on(responseChannel, function(path) {
        ipc.removeAllListeners(responseChannel);
        return callback(path);
      });
      return ipc.send("pick-folder", responseChannel);
    };

    Atom.prototype.close = function() {
      return this.getCurrentWindow().close();
    };

    Atom.prototype.getSize = function() {
      var height, width, _ref1;
      _ref1 = this.getCurrentWindow().getSize(), width = _ref1[0], height = _ref1[1];
      return {
        width: width,
        height: height
      };
    };

    Atom.prototype.setSize = function(width, height) {
      return this.getCurrentWindow().setSize(width, height);
    };

    Atom.prototype.getPosition = function() {
      var x, y, _ref1;
      _ref1 = this.getCurrentWindow().getPosition(), x = _ref1[0], y = _ref1[1];
      return {
        x: x,
        y: y
      };
    };

    Atom.prototype.setPosition = function(x, y) {
      return ipc.send('call-window-method', 'setPosition', x, y);
    };

    Atom.prototype.getCurrentWindow = function() {
      return this.constructor.getCurrentWindow();
    };

    Atom.prototype.center = function() {
      return ipc.send('call-window-method', 'center');
    };

    Atom.prototype.focus = function() {
      ipc.send('call-window-method', 'focus');
      return $(window).focus();
    };

    Atom.prototype.show = function() {
      return ipc.send('call-window-method', 'show');
    };

    Atom.prototype.hide = function() {
      return ipc.send('call-window-method', 'hide');
    };

    Atom.prototype.reload = function() {
      return ipc.send('call-window-method', 'restart');
    };

    Atom.prototype.isMaximixed = function() {
      return this.getCurrentWindow().isMaximized();
    };

    Atom.prototype.maximize = function() {
      return ipc.send('call-window-method', 'maximize');
    };

    Atom.prototype.isFullScreen = function() {
      return this.getCurrentWindow().isFullScreen();
    };

    Atom.prototype.setFullScreen = function(fullScreen) {
      if (fullScreen == null) {
        fullScreen = false;
      }
      ipc.send('call-window-method', 'setFullScreen', fullScreen);
      if (fullScreen) {
        return document.body.classList.add("fullscreen");
      } else {
        return document.body.classList.remove("fullscreen");
      }
    };

    Atom.prototype.toggleFullScreen = function() {
      return this.setFullScreen(!this.isFullScreen());
    };

    Atom.prototype.displayWindow = function(_arg) {
      var maximize;
      maximize = (_arg != null ? _arg : {}).maximize;
      return setImmediate((function(_this) {
        return function() {
          _this.show();
          _this.focus();
          if (_this.workspace.fullScreen) {
            _this.setFullScreen(true);
          }
          if (maximize) {
            return _this.maximize();
          }
        };
      })(this));
    };

    Atom.prototype.getWindowDimensions = function() {
      var browserWindow, height, maximized, width, x, y, _ref1, _ref2;
      browserWindow = this.getCurrentWindow();
      _ref1 = browserWindow.getPosition(), x = _ref1[0], y = _ref1[1];
      _ref2 = browserWindow.getSize(), width = _ref2[0], height = _ref2[1];
      maximized = browserWindow.isMaximized();
      return {
        x: x,
        y: y,
        width: width,
        height: height,
        maximized: maximized
      };
    };

    Atom.prototype.setWindowDimensions = function(_arg) {
      var height, width, x, y;
      x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height;
      if ((width != null) && (height != null)) {
        this.setSize(width, height);
      }
      if ((x != null) && (y != null)) {
        return this.setPosition(x, y);
      } else {
        return this.center();
      }
    };

    Atom.prototype.isValidDimensions = function(_arg) {
      var height, width, x, y, _ref1;
      _ref1 = _arg != null ? _arg : {}, x = _ref1.x, y = _ref1.y, width = _ref1.width, height = _ref1.height;
      return width > 0 && height > 0 && x + width > 0 && y + height > 0;
    };

    Atom.prototype.storeDefaultWindowDimensions = function() {
      var dimensions;
      dimensions = this.getWindowDimensions();
      if (this.isValidDimensions(dimensions)) {
        return localStorage.setItem("defaultWindowDimensions", JSON.stringify(dimensions));
      }
    };

    Atom.prototype.getDefaultWindowDimensions = function() {
      var dimensions, error, height, screen, width, windowDimensions, _ref1;
      windowDimensions = this.getLoadSettings().windowDimensions;
      if (windowDimensions != null) {
        return windowDimensions;
      }
      dimensions = null;
      try {
        dimensions = JSON.parse(localStorage.getItem("defaultWindowDimensions"));
      } catch (_error) {
        error = _error;
        console.warn("Error parsing default window dimensions", error);
        localStorage.removeItem("defaultWindowDimensions");
      }
      if (this.isValidDimensions(dimensions)) {
        return dimensions;
      } else {
        screen = remote.require('screen');
        _ref1 = screen.getPrimaryDisplay().workAreaSize, width = _ref1.width, height = _ref1.height;
        return {
          x: 0,
          y: 0,
          width: Math.min(1024, width),
          height: height
        };
      }
    };

    Atom.prototype.restoreWindowDimensions = function() {
      var dimensions;
      dimensions = this.state.windowDimensions;
      if (!this.isValidDimensions(dimensions)) {
        dimensions = this.getDefaultWindowDimensions();
      }
      this.setWindowDimensions(dimensions);
      return dimensions;
    };

    Atom.prototype.storeWindowDimensions = function() {
      var dimensions;
      dimensions = this.getWindowDimensions();
      if (this.isValidDimensions(dimensions)) {
        return this.state.windowDimensions = dimensions;
      }
    };

    Atom.prototype.startEditorWindow = function() {
      var CommandInstaller, dimensions, maximize, resourcePath, safeMode, _ref1;
      _ref1 = this.getLoadSettings(), resourcePath = _ref1.resourcePath, safeMode = _ref1.safeMode;
      CommandInstaller = require('./command-installer');
      CommandInstaller.installAtomCommand(resourcePath, false, function(error) {
        if (error != null) {
          return console.warn(error.message);
        }
      });
      CommandInstaller.installApmCommand(resourcePath, false, function(error) {
        if (error != null) {
          return console.warn(error.message);
        }
      });
      dimensions = this.restoreWindowDimensions();
      this.loadConfig();
      this.keymaps.loadBundledKeymaps();
      this.themes.loadBaseStylesheets();
      this.packages.loadPackages();
      this.deserializeEditorWindow();
      this.watchProjectPath();
      this.packages.activate();
      this.keymaps.loadUserKeymap();
      if (!safeMode) {
        this.requireUserInitScript();
      }
      this.menu.update();
      this.subscribe(this.config.onDidChange('core.autoHideMenuBar', (function(_this) {
        return function(_arg) {
          var newValue;
          newValue = _arg.newValue;
          return _this.setAutoHideMenuBar(newValue);
        };
      })(this)));
      if (this.config.get('core.autoHideMenuBar')) {
        this.setAutoHideMenuBar(true);
      }
      this.openInitialEmptyEditorIfNecessary();
      maximize = (dimensions != null ? dimensions.maximized : void 0) && process.platform !== 'darwin';
      return this.displayWindow({
        maximize: maximize
      });
    };

    Atom.prototype.unloadEditorWindow = function() {
      if (!this.project) {
        return;
      }
      this.state.grammars = this.grammars.serialize();
      this.state.project = this.project.serialize();
      this.state.workspace = this.workspace.serialize();
      this.packages.deactivatePackages();
      this.state.packageStates = this.packages.packageStates;
      this.saveSync();
      return this.windowState = null;
    };

    Atom.prototype.removeEditorWindow = function() {
      var _ref1, _ref2, _ref3;
      if (!this.project) {
        return;
      }
      if ((_ref1 = this.workspace) != null) {
        _ref1.destroy();
      }
      this.workspace = null;
      if ((_ref2 = this.project) != null) {
        _ref2.destroy();
      }
      this.project = null;
      return (_ref3 = this.windowEventHandler) != null ? _ref3.unsubscribe() : void 0;
    };

    Atom.prototype.openInitialEmptyEditorIfNecessary = function() {
      var _ref1;
      if (((_ref1 = this.getLoadSettings().initialPaths) != null ? _ref1.length : void 0) === 0 && this.workspace.getPaneItems().length === 0) {
        return this.workspace.open(null);
      }
    };


    /*
    Section: Messaging the User
     */

    Atom.prototype.beep = function() {
      var _ref1;
      if (this.config.get('core.audioBeep')) {
        shell.beep();
      }
      if ((_ref1 = this.__workspaceView) != null) {
        _ref1.trigger('beep');
      }
      return this.emitter.emit('did-beep');
    };

    Atom.prototype.confirm = function(_arg) {
      var buttonLabels, buttons, callback, chosen, detailedMessage, dialog, message, _ref1;
      _ref1 = _arg != null ? _arg : {}, message = _ref1.message, detailedMessage = _ref1.detailedMessage, buttons = _ref1.buttons;
      if (buttons == null) {
        buttons = {};
      }
      if (_.isArray(buttons)) {
        buttonLabels = buttons;
      } else {
        buttonLabels = Object.keys(buttons);
      }
      dialog = remote.require('dialog');
      chosen = dialog.showMessageBox(this.getCurrentWindow(), {
        type: 'info',
        message: message,
        detail: detailedMessage,
        buttons: buttonLabels
      });
      if (_.isArray(buttons)) {
        return chosen;
      } else {
        callback = buttons[buttonLabels[chosen]];
        return typeof callback === "function" ? callback() : void 0;
      }
    };


    /*
    Section: Managing the Dev Tools
     */

    Atom.prototype.openDevTools = function() {
      return ipc.send('call-window-method', 'openDevTools');
    };

    Atom.prototype.toggleDevTools = function() {
      return ipc.send('call-window-method', 'toggleDevTools');
    };

    Atom.prototype.executeJavaScriptInDevTools = function(code) {
      return ipc.send('call-window-method', 'executeJavaScriptInDevTools', code);
    };


    /*
    Section: Private
     */

    Atom.prototype.deserializeProject = function() {
      var Project, startTime, _ref1;
      Project = require('./project');
      startTime = Date.now();
      if (this.project == null) {
        this.project = (_ref1 = this.deserializers.deserialize(this.state.project)) != null ? _ref1 : new Project();
      }
      return this.deserializeTimings.project = Date.now() - startTime;
    };

    Atom.prototype.deserializeWorkspaceView = function() {
      var Workspace, WorkspaceView, startTime, workspaceElement, _ref1;
      Workspace = require('./workspace');
      WorkspaceView = require('./workspace-view');
      startTime = Date.now();
      this.workspace = (_ref1 = Workspace.deserialize(this.state.workspace)) != null ? _ref1 : new Workspace;
      workspaceElement = this.views.getView(this.workspace);
      this.__workspaceView = workspaceElement.__spacePenView;
      this.deserializeTimings.workspace = Date.now() - startTime;
      this.keymaps.defaultTarget = workspaceElement;
      return document.querySelector(this.workspaceViewParentSelector).appendChild(workspaceElement);
    };

    Atom.prototype.deserializePackageStates = function() {
      var _ref1;
      this.packages.packageStates = (_ref1 = this.state.packageStates) != null ? _ref1 : {};
      return delete this.state.packageStates;
    };

    Atom.prototype.deserializeEditorWindow = function() {
      this.deserializePackageStates();
      this.deserializeProject();
      return this.deserializeWorkspaceView();
    };

    Atom.prototype.loadConfig = function() {
      this.config.setSchema(null, {
        type: 'object',
        properties: _.clone(require('./config-schema'))
      });
      return this.config.load();
    };

    Atom.prototype.loadThemes = function() {
      return this.themes.load();
    };

    Atom.prototype.watchThemes = function() {
      return this.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          var pack, _i, _len, _ref1;
          _ref1 = _this.packages.getActivePackages();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            pack = _ref1[_i];
            if (pack.getType() !== 'theme') {
              if (typeof pack.reloadStylesheets === "function") {
                pack.reloadStylesheets();
              }
            }
          }
          return null;
        };
      })(this));
    };

    Atom.prototype.watchProjectPath = function() {
      var onProjectPathChanged;
      onProjectPathChanged = (function(_this) {
        return function() {
          return ipc.send('window-command', 'project-path-changed', _this.project.getPaths());
        };
      })(this);
      this.subscribe(this.project.onDidChangePaths(onProjectPathChanged));
      return onProjectPathChanged();
    };

    Atom.prototype.exit = function(status) {
      var app;
      app = remote.require('app');
      app.emit('will-exit');
      return remote.process.exit(status);
    };

    Atom.prototype.setDocumentEdited = function(edited) {
      return ipc.send('call-window-method', 'setDocumentEdited', edited);
    };

    Atom.prototype.setRepresentedFilename = function(filename) {
      return ipc.send('call-window-method', 'setRepresentedFilename', filename);
    };

    Atom.prototype.showSaveDialog = function(callback) {
      return callback(showSaveDialogSync());
    };

    Atom.prototype.showSaveDialogSync = function(defaultPath) {
      var currentWindow, dialog, _ref1;
      if (defaultPath == null) {
        defaultPath = (_ref1 = this.project) != null ? _ref1.getPath() : void 0;
      }
      currentWindow = this.getCurrentWindow();
      dialog = remote.require('dialog');
      return dialog.showSaveDialog(currentWindow, {
        title: 'Save File',
        defaultPath: defaultPath
      });
    };

    Atom.prototype.saveSync = function() {
      var statePath, stateString, _ref1;
      stateString = JSON.stringify(this.state);
      if (statePath = this.constructor.getStatePath((_ref1 = this.project) != null ? _ref1.getPaths() : void 0, this.mode)) {
        return fs.writeFileSync(statePath, stateString, 'utf8');
      } else {
        return this.getCurrentWindow().loadSettings.windowState = stateString;
      }
    };

    Atom.prototype.crashMainProcess = function() {
      return remote.process.crash();
    };

    Atom.prototype.crashRenderProcess = function() {
      return process.crash();
    };

    Atom.prototype.getUserInitScriptPath = function() {
      var initScriptPath;
      initScriptPath = fs.resolve(this.getConfigDirPath(), 'init', ['js', 'coffee']);
      return initScriptPath != null ? initScriptPath : path.join(this.getConfigDirPath(), 'init.coffee');
    };

    Atom.prototype.requireUserInitScript = function() {
      var error, userInitScriptPath;
      if (userInitScriptPath = this.getUserInitScriptPath()) {
        try {
          if (fs.isFileSync(userInitScriptPath)) {
            return require(userInitScriptPath);
          }
        } catch (_error) {
          error = _error;
          return atom.notifications.addError("Failed to load `" + userInitScriptPath + "`", {
            detail: error.message,
            dismissable: true
          });
        }
      }
    };

    Atom.prototype.requireWithGlobals = function(id, globals) {
      var existingGlobals, key, value, _results;
      if (globals == null) {
        globals = {};
      }
      existingGlobals = {};
      for (key in globals) {
        value = globals[key];
        existingGlobals[key] = window[key];
        window[key] = value;
      }
      require(id);
      _results = [];
      for (key in existingGlobals) {
        value = existingGlobals[key];
        if (value === void 0) {
          _results.push(delete window[key]);
        } else {
          _results.push(window[key] = value);
        }
      }
      return _results;
    };

    Atom.prototype.onUpdateAvailable = function(callback) {
      return this.emitter.on('update-available', callback);
    };

    Atom.prototype.updateAvailable = function(details) {
      return this.emitter.emit('update-available', details);
    };

    Atom.prototype.registerRepresentationClass = function() {
      return deprecate("Callers should be converted to use atom.deserializers");
    };

    Atom.prototype.registerRepresentationClasses = function() {
      return deprecate("Callers should be converted to use atom.deserializers");
    };

    Atom.prototype.setBodyPlatformClass = function() {
      return document.body.classList.add("platform-" + process.platform);
    };

    Atom.prototype.setAutoHideMenuBar = function(autoHide) {
      ipc.send('call-window-method', 'setAutoHideMenuBar', autoHide);
      return ipc.send('call-window-method', 'setMenuBarVisibility', !autoHide);
    };

    return Atom;

  })(Model);

}).call(this);
