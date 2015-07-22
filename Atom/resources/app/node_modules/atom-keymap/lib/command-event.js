(function() {
  var CommandEvent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = CommandEvent = (function(_super) {
    __extends(CommandEvent, _super);

    function CommandEvent() {
      return CommandEvent.__super__.constructor.apply(this, arguments);
    }

    CommandEvent.prototype.keyBindingAborted = false;

    CommandEvent.prototype.propagationStopped = false;

    CommandEvent.prototype.abortKeyBinding = function() {
      this.stopImmediatePropagation();
      return this.keyBindingAborted = true;
    };

    CommandEvent.prototype.stopPropagation = function() {
      this.propagationStopped = true;
      return CommandEvent.__super__.stopPropagation.apply(this, arguments);
    };

    CommandEvent.prototype.stopImmediatePropagation = function() {
      this.propagationStopped = true;
      return CommandEvent.__super__.stopImmediatePropagation.apply(this, arguments);
    };

    return CommandEvent;

  })(CustomEvent);

}).call(this);
