(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Marionette, TimerController, _, _ref;
    $ = require('jquery');
    _ = require('underscore');
    Marionette = require('marionette');
    return TimerController = (function(_super) {
      __extends(TimerController, _super);

      function TimerController() {
        _ref = TimerController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TimerController.prototype.startTime = 0;

      TimerController.prototype.stopTime = 0;

      TimerController.prototype.elapsedTime = 0;

      TimerController.prototype.interval = null;

      TimerController.prototype.initialize = function() {
        if (typeof window.performance !== 'undefined') {
          this.performance = window.performance;
          return this.performance.now = performance.now || performance.webkitNow || performance.msNow || performance.oNow || performance.mozNow;
        } else {
          this.performance = {};
          return this.performance.now = Date.now;
        }
      };

      TimerController.prototype.now = function() {
        return this.performance.now();
      };

      TimerController.prototype.reset = function() {
        this.startTime = 0;
        this.stopTime = 0;
        return this.elapsedTime = 0;
      };

      TimerController.prototype.start = function() {
        this.reset();
        return this.startTime = this.now();
      };

      TimerController.prototype.stop = function() {
        if (this.stopTime === 0) {
          this.stopTime = this.now();
          return this.elapsedTime = this.stopTime - this.startTime;
        }
      };

      TimerController.prototype.getElapsedTime = function() {
        if (this.stopTime === 0) {
          this.elapsedTime = this.now() - this.startTime;
        }
        return Math.round(this.elapsedTime);
      };

      return TimerController;

    })(Marionette.Controller);
  });

}).call(this);
