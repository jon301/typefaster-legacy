(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    'use strict';
    var $, Logger, PlayerGhostModel, PlayerModel, TimerController, _, _ref;
    $ = require('jquery');
    _ = require('underscore');
    Logger = require('js_logger');
    PlayerModel = require('models/player');
    TimerController = require('controllers/timer');
    return PlayerGhostModel = (function(_super) {
      __extends(PlayerGhostModel, _super);

      function PlayerGhostModel() {
        _ref = PlayerGhostModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlayerGhostModel.prototype.initialize = function(options) {
        PlayerGhostModel.__super__.initialize.call(this, options);
        this.logger = Logger.get('PlayerGhostModel');
        this.color = options.color;
        return this.replayLogs = options.replayLogs;
      };

      PlayerGhostModel.prototype.play = function() {
        PlayerGhostModel.__super__.play.call(this);
        this.replayLogsTmp = this.replayLogs.slice(0);
        this.entryLog = null;
        return this.replay();
      };

      PlayerGhostModel.prototype.stop = function() {
        PlayerGhostModel.__super__.stop.call(this);
        return clearTimeout(this.timeout);
      };

      PlayerGhostModel.prototype.replay = function() {
        if (!this.entryLog) {
          this.entryLog = this.replayLogsTmp.shift();
        }
        if (this.timer.getElapsedTime() >= this.entryLog.t) {
          if (this.entryLog.v === -1) {
            this.deleteEntry();
          } else {
            this.typeEntry(this.entryLog.v);
          }
          this.entryLog = this.replayLogsTmp.shift();
        }
        if (this.entryLog) {
          return this.timeout = setTimeout($.proxy(this.replay, this), 1);
        }
      };

      PlayerGhostModel.prototype.getType = function() {
        return 'ghost';
      };

      PlayerGhostModel.prototype.getColor = function() {
        return this.color;
      };

      return PlayerGhostModel;

    })(PlayerModel);
  });

}).call(this);
