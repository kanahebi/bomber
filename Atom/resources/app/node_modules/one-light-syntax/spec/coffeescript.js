(function() {
  var Animal, OPERATOR, grade, heredoc, hi, math, race, square, two,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  grade = function(student, period, messages) {
    if (period == null) {
      period = (typeof b !== "undefined" && b !== null ? 7 : 6);
    }
    if (messages == null) {
      messages = {
        "A": "Excellent"
      };
    }
    if (student.excellentWork) {
      return "A+";
    } else if (student.okayStuff) {
      if (student.triedHard) {
        return "B";
      } else {
        return "B-";
      }
    } else {
      return "C";
    }
  };

  square = function(x) {
    return x * x;
  };

  two = function() {
    return 2;
  };

  math = {
    root: Math.sqrt,
    square: square,
    cube: function(x) {
      return x * square(x);
    }
  };

  race = function() {
    var runners, winner;
    winner = arguments[0], runners = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return print(winner, runners);
  };

  Animal = (function(_super) {
    __extends(Animal, _super);

    function Animal(name) {
      this.name = name;
    }

    Animal.prototype.move = function(meters) {
      return alert(this.name + (" moved " + meters + "m."));
    };

    return Animal;

  })(Being);

  hi = function() {
  return [document.title, "Hello JavaScript"].join(": ");
};

  heredoc = "CoffeeScript subst test " + (0x8 + 0xf / 0x2 + ("nested string " + /\n/));


  /*
  CoffeeScript Compiler v1.2.0
  Released under the MIT License
   */

  OPERATOR = /^(?:[-=]>)/;

}).call(this);
