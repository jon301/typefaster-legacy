(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'js_logger', 'models/player'], function($, _, Logger, PlayerModel) {
    'use strict';
    var PlayerHumanModel, _ref;
    return PlayerHumanModel = (function(_super) {
      __extends(PlayerHumanModel, _super);

      function PlayerHumanModel() {
        _ref = PlayerHumanModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlayerHumanModel.prototype.replayLogs = [];

      PlayerHumanModel.prototype.initialize = function(options) {
        PlayerHumanModel.__super__.initialize.call(this, options);
        return this.logger = Logger.get('PlayerHumanModel');
      };

      PlayerHumanModel.prototype.stop = function() {
        PlayerHumanModel.__super__.stop.call(this);
        this.logger.debug(JSON.stringify(this.replayLogs));
        return this.gameController.trigger('human:stop');
      };

      PlayerHumanModel.prototype.reset = function() {
        PlayerHumanModel.__super__.reset.call(this);
        return this.replayLogs = [];
      };

      PlayerHumanModel.prototype.typeEntry = function(entry) {
        this.replayLogs.push({
          t: this.timer.getElapsedTime(),
          v: entry
        });
        return PlayerHumanModel.__super__.typeEntry.call(this, entry);
      };

      PlayerHumanModel.prototype.deleteEntry = function() {
        if (PlayerHumanModel.__super__.deleteEntry.call(this)) {
          return this.replayLogs.push({
            t: this.timer.getElapsedTime(),
            v: -1
          });
        }
      };

      PlayerHumanModel.prototype.getReplayLogs = function() {
        return this.replayLogs;
      };

      return PlayerHumanModel;

    })(PlayerModel);
  });

}).call(this);
