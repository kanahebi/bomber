(function() {
  var $, CommandRegistry, CompositeDisposable, Disposable, Emitter, InlineListener, SelectorBasedListener, SequenceCount, SpecificityCache, specificity, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  specificity = require('clear-cut').specificity;

  _ = require('underscore-plus');

  $ = require('./space-pen-extensions').$;

  SequenceCount = 0;

  SpecificityCache = {};

  module.exports = CommandRegistry = (function() {
    function CommandRegistry(rootNode) {
      this.rootNode = rootNode;
      this.handleCommandEvent = __bind(this.handleCommandEvent, this);
      this.registeredCommands = {};
      this.selectorBasedListenersByCommandName = {};
      this.inlineListenersByCommandName = {};
      this.emitter = new Emitter;
    }

    CommandRegistry.prototype.destroy = function() {
      var commandName, _results;
      _results = [];
      for (commandName in this.registeredCommands) {
        _results.push(window.removeEventListener(commandName, this.handleCommandEvent, true));
      }
      return _results;
    };

    CommandRegistry.prototype.add = function(target, commandName, callback) {
      var commands, disposable;
      if (typeof commandName === 'object') {
        commands = commandName;
        disposable = new CompositeDisposable;
        for (commandName in commands) {
          callback = commands[commandName];
          disposable.add(this.add(target, commandName, callback));
        }
        return disposable;
      }
      if (typeof target === 'string') {
        return this.addSelectorBasedListener(target, commandName, callback);
      } else {
        return this.addInlineListener(target, commandName, callback);
      }
    };

    CommandRegistry.prototype.addSelectorBasedListener = function(selector, commandName, callback) {
      var listener, listenersForCommand, _base;
      if ((_base = this.selectorBasedListenersByCommandName)[commandName] == null) {
        _base[commandName] = [];
      }
      listenersForCommand = this.selectorBasedListenersByCommandName[commandName];
      listener = new SelectorBasedListener(selector, callback);
      listenersForCommand.push(listener);
      this.commandRegistered(commandName);
      return new Disposable((function(_this) {
        return function() {
          listenersForCommand.splice(listenersForCommand.indexOf(listener), 1);
          if (listenersForCommand.length === 0) {
            return delete _this.selectorBasedListenersByCommandName[commandName];
          }
        };
      })(this));
    };

    CommandRegistry.prototype.addInlineListener = function(element, commandName, callback) {
      var listener, listenersForCommand, listenersForElement, _base;
      if ((_base = this.inlineListenersByCommandName)[commandName] == null) {
        _base[commandName] = new WeakMap;
      }
      listenersForCommand = this.inlineListenersByCommandName[commandName];
      if (!(listenersForElement = listenersForCommand.get(element))) {
        listenersForElement = [];
        listenersForCommand.set(element, listenersForElement);
      }
      listener = new InlineListener(callback);
      listenersForElement.push(listener);
      this.commandRegistered(commandName);
      return new Disposable(function() {
        listenersForElement.splice(listenersForElement.indexOf(listener), 1);
        if (listenersForElement.length === 0) {
          return listenersForCommand["delete"](element);
        }
      });
    };

    CommandRegistry.prototype.findCommands = function(_arg) {
      var commandName, commandNames, commands, currentTarget, listener, listeners, name, target, _i, _len, _ref1, _ref2, _ref3;
      target = _arg.target;
      commandNames = new Set;
      commands = [];
      currentTarget = target;
      while (true) {
        _ref1 = this.inlineListenersByCommandName;
        for (name in _ref1) {
          listeners = _ref1[name];
          if (listeners.has(currentTarget) && !commandNames.has(name)) {
            commandNames.add(name);
            commands.push({
              name: name,
              displayName: _.humanizeEventName(name)
            });
          }
        }
        _ref2 = this.selectorBasedListenersByCommandName;
        for (commandName in _ref2) {
          listeners = _ref2[commandName];
          for (_i = 0, _len = listeners.length; _i < _len; _i++) {
            listener = listeners[_i];
            if (typeof currentTarget.webkitMatchesSelector === "function" ? currentTarget.webkitMatchesSelector(listener.selector) : void 0) {
              if (!commandNames.has(commandName)) {
                commandNames.add(commandName);
                commands.push({
                  name: commandName,
                  displayName: _.humanizeEventName(commandName)
                });
              }
            }
          }
        }
        if (currentTarget === window) {
          break;
        }
        currentTarget = (_ref3 = currentTarget.parentNode) != null ? _ref3 : window;
      }
      return commands;
    };

    CommandRegistry.prototype.dispatch = function(target, commandName, detail) {
      var event, eventWithTarget;
      event = new CustomEvent(commandName, {
        bubbles: true,
        detail: detail
      });
      eventWithTarget = Object.create(event, {
        target: {
          value: target
        },
        preventDefault: {
          value: function() {}
        },
        stopPropagation: {
          value: function() {}
        },
        stopImmediatePropagation: {
          value: function() {}
        }
      });
      return this.handleCommandEvent(eventWithTarget);
    };

    CommandRegistry.prototype.onWillDispatch = function(callback) {
      return this.emitter.on('will-dispatch', callback);
    };

    CommandRegistry.prototype.getSnapshot = function() {
      var commandName, listeners, snapshot, _ref1;
      snapshot = {};
      _ref1 = this.selectorBasedListenersByCommandName;
      for (commandName in _ref1) {
        listeners = _ref1[commandName];
        snapshot[commandName] = listeners.slice();
      }
      return snapshot;
    };

    CommandRegistry.prototype.restoreSnapshot = function(snapshot) {
      var commandName, listeners, _results;
      this.selectorBasedListenersByCommandName = {};
      _results = [];
      for (commandName in snapshot) {
        listeners = snapshot[commandName];
        _results.push(this.selectorBasedListenersByCommandName[commandName] = listeners.slice());
      }
      return _results;
    };

    CommandRegistry.prototype.handleCommandEvent = function(originalEvent) {
      var currentTarget, immediatePropagationStopped, listener, listeners, matched, propagationStopped, selectorBasedListeners, syntheticEvent, _i, _len, _ref1, _ref2, _ref3, _ref4;
      propagationStopped = false;
      immediatePropagationStopped = false;
      matched = false;
      currentTarget = originalEvent.target;
      syntheticEvent = Object.create(originalEvent, {
        eventPhase: {
          value: Event.BUBBLING_PHASE
        },
        currentTarget: {
          get: function() {
            return currentTarget;
          }
        },
        preventDefault: {
          value: function() {
            return originalEvent.preventDefault();
          }
        },
        stopPropagation: {
          value: function() {
            originalEvent.stopPropagation();
            return propagationStopped = true;
          }
        },
        stopImmediatePropagation: {
          value: function() {
            originalEvent.stopImmediatePropagation();
            propagationStopped = true;
            return immediatePropagationStopped = true;
          }
        },
        abortKeyBinding: {
          value: function() {
            return typeof originalEvent.abortKeyBinding === "function" ? originalEvent.abortKeyBinding() : void 0;
          }
        }
      });
      this.emitter.emit('will-dispatch', syntheticEvent);
      while (true) {
        listeners = (_ref1 = (_ref2 = this.inlineListenersByCommandName[originalEvent.type]) != null ? _ref2.get(currentTarget) : void 0) != null ? _ref1 : [];
        if (currentTarget.webkitMatchesSelector != null) {
          selectorBasedListeners = ((_ref3 = this.selectorBasedListenersByCommandName[originalEvent.type]) != null ? _ref3 : []).filter(function(listener) {
            return currentTarget.webkitMatchesSelector(listener.selector);
          }).sort(function(a, b) {
            return a.compare(b);
          });
          listeners = listeners.concat(selectorBasedListeners);
        }
        if (listeners.length > 0) {
          matched = true;
        }
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          if (immediatePropagationStopped) {
            break;
          }
          listener.callback.call(currentTarget, syntheticEvent);
        }
        if (currentTarget === window) {
          break;
        }
        if (propagationStopped) {
          break;
        }
        currentTarget = (_ref4 = currentTarget.parentNode) != null ? _ref4 : window;
      }
      return matched;
    };

    CommandRegistry.prototype.commandRegistered = function(commandName) {
      if (!this.registeredCommands[commandName]) {
        window.addEventListener(commandName, this.handleCommandEvent, true);
        return this.registeredCommands[commandName] = true;
      }
    };

    return CommandRegistry;

  })();

  SelectorBasedListener = (function() {
    function SelectorBasedListener(selector, callback) {
      var _name;
      this.selector = selector;
      this.callback = callback;
      this.specificity = (SpecificityCache[_name = this.selector] != null ? SpecificityCache[_name] : SpecificityCache[_name] = specificity(this.selector));
      this.sequenceNumber = SequenceCount++;
    }

    SelectorBasedListener.prototype.compare = function(other) {
      return other.specificity - this.specificity || other.sequenceNumber - this.sequenceNumber;
    };

    return SelectorBasedListener;

  })();

  InlineListener = (function() {
    function InlineListener(callback) {
      this.callback = callback;
    }

    return InlineListener;

  })();

}).call(this);
