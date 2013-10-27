(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'models/player'], function($, _, PlayerModel) {
    'use strict';
    var PlayerHumanModel, _ref;
    return PlayerHumanModel = (function(_super) {
      __extends(PlayerHumanModel, _super);

      function PlayerHumanModel() {
        _ref = PlayerHumanModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlayerHumanModel.prototype.replayLogs = [];

      PlayerHumanModel.prototype.stop = function() {
        PlayerHumanModel.__super__.stop.call(this);
        console.log(JSON.stringify(this.replayLogs));
        return this.gameController.trigger('human:stop');
      };

      PlayerHumanModel.prototype.typeEntry = function(entry) {
        PlayerHumanModel.__super__.typeEntry.call(this, entry);
        return this.replayLogs.push({
          t: this.timer.getElapsedTime(),
          v: entry
        });
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
