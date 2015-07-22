(function() {
  var CustomEventMixin;

  module.exports = CustomEventMixin = {
    componentWillMount: function() {
      return this.customEventListeners = {};
    },
    componentWillUnmount: function() {
      var listener, listeners, name, _i, _len, _ref, _results;
      _ref = this.customEventListeners;
      _results = [];
      for (listeners = _i = 0, _len = _ref.length; _i < _len; listeners = ++_i) {
        name = _ref[listeners];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = listeners.length; _j < _len1; _j++) {
            listener = listeners[_j];
            _results1.push(this.getDOMNode().removeEventListener(name, listener));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    addCustomEventListeners: function(customEventListeners) {
      var listener, name, _base, _results;
      _results = [];
      for (name in customEventListeners) {
        listener = customEventListeners[name];
        if ((_base = this.customEventListeners)[name] == null) {
          _base[name] = [];
        }
        this.customEventListeners[name].push(listener);
        _results.push(this.getDOMNode().addEventListener(name, listener));
      }
      return _results;
    }
  };

}).call(this);
