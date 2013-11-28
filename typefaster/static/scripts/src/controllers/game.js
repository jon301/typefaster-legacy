/*
    Speed : Raw speed with mistake penalties
        Speed = Raw speed - Error Rate

    Accuracy : The percentage of correct entries out of the total entries typed
        Accuracy = (Correct Entries / Total Entries) x 100

    Correct Entries : All keys typed correctly (even correct entries deleted then re-entered correctly again)

    Incorrect Entries : All keys typed incorrectly (even if deleted and corrected later)

    Fixed Mistakes : All incorrect entries that were fixed later (number of mistakes deleted and entered correctly)

    Total Entries : All keys typed (excluding function keys)
        Total Entries = Correct Entries + Incorrect Entries

    Error Rate : Number of incorrect Entries (unfixed mistakes) per minute
        Error Rate = (Incorrect Entries - Fixed Mistakes) / Time in Minutes

    Raw Speed : Typing Speed before mistake penalties
        Raw Speed = ( Total Entries / Time in minutes ) / 5
        (where 5 = average length of a word)

    Key Speed : Number of keystrokes per minute
        Key Speed = Total Entries / Time in minutes

    Complete Words : Number of complete words typed ('the' and 'messenger' are both one word)

    Total Time : Total time of round in minutes
        Time in minutes = Time in seconds / 60
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'marionette', 'js_logger', 'controllers/timer', 'models/player_human', 'models/player_ghost', 'views/item/typezone'], function($, _, Backbone, Marionette, Logger, TimerController, PlayerHumanModel, PlayerGhostModel, TypeZoneView) {
    'use strict';
    var GameController, _ref;
    return GameController = (function(_super) {
      __extends(GameController, _super);

      function GameController() {
        _ref = GameController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GameController.prototype.entries = '';

      GameController.prototype.duration = 60;

      GameController.prototype.ghostColors = ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'silver', 'teal', 'yellow', 'orange', 'purple', 'red'];

      GameController.prototype.initialize = function(options) {
        var _this = this;
        this.logger = Logger.get('GameController');
        this.duration = options.duration;
        this.entries = options.entries;
        this.players = new Backbone.Collection();
        this.listenTo(this.players, 'add', function(playerModel) {
          return _this.trigger('player:add', playerModel);
        });
        this.listenTo(this.players, 'remove', function(playerModel) {
          return _this.trigger('player:remove', playerModel);
        });
        this.timer = new TimerController();
        this.on('human:stop', function() {
          return _this.stop();
        });
        return this.on('keyboard:escape', function() {
          return _this.stop();
        });
      };

      GameController.prototype.start = function() {
        var _this = this;
        if (!this.running) {
          this.logger.debug('Game started');
          this.running = true;
          this.players.invoke('play');
          if (this.duration) {
            this.timer.start();
            return this.interval = setInterval(function() {
              if (_this.timer.getElapsedTime() >= _this.duration * 1000) {
                _this.stop();
              }
              if (typeof _this.humanPlayer !== 'undefined') {
                return _this.trigger('human:stats', _this.humanPlayer.getStats());
              }
            }, 1000);
          }
        }
      };

      GameController.prototype.stop = function() {
        if (this.running) {
          this.logger.debug('Game stopped');
          this.running = false;
          clearInterval(this.interval);
          this.timer.stop();
          return this.players.invoke('stop');
        }
      };

      GameController.prototype.setEntries = function(entries) {
        if (!this.running) {
          if (entries) {
            return this.entries = entries;
          }
        }
      };

      GameController.prototype.setDuration = function(duration) {
        if (!this.running) {
          if (duration) {
            return this.duration = duration;
          }
        }
      };

      GameController.prototype.addHuman = function() {
        if (!(this.running && this.humanPlayer)) {
          this.humanPlayer = new PlayerHumanModel({
            gameController: this
          });
          return this.players.add(this.humanPlayer);
        }
      };

      GameController.prototype.removeHuman = function() {};

      GameController.prototype.addGhost = function(replayLogs) {
        if (!this.running) {
          return this.players.add(new PlayerGhostModel({
            gameController: this,
            replayLogs: replayLogs,
            color: this.ghostColors.pop()
          }));
        }
      };

      GameController.prototype.removeGhost = function(cid) {};

      return GameController;

    })(Marionette.Controller);
  });

}).call(this);
