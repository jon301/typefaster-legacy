(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    "use strict";
    var PlayerModel, _ref;
    return PlayerModel = (function(_super) {
      __extends(PlayerModel, _super);

      function PlayerModel() {
        _ref = PlayerModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      PlayerModel.prototype.ENTRY_CORRECT = 1;

      PlayerModel.prototype.ENTRY_INCORRECT = -1;

      PlayerModel.prototype.ENTRY_TO_BE_FIXED = 0;

      PlayerModel.prototype.ENTRY_DELETED = 2;

      PlayerModel.prototype.entries = '';

      PlayerModel.prototype.correctEntries = 0;

      PlayerModel.prototype.incorrectEntries = 0;

      PlayerModel.prototype.fixedMistakes = 0;

      PlayerModel.prototype.currentIndex = 0;

      PlayerModel.prototype.entriesMapStatus = [];

      PlayerModel.prototype.entriesLogs = [];

      PlayerModel.prototype.initialize = function(options) {
        return this.entries = options.entries;
      };

      PlayerModel.prototype.typeEntry = function(entry, elapsedTime) {
        this.entriesLogs.push({
          t: elapsedTime,
          v: entry
        });
        if (entry === this.entries[this.currentIndex]) {
          console.log('entry:is_correct', entry, this.entries[this.currentIndex]);
          this.correctEntries++;
          if (this.entriesMapStatus[this.currentIndex] === this.ENTRY_TO_BE_FIXED) {
            this.fixedMistakes++;
          }
          this.entriesMapStatus[this.currentIndex] = this.ENTRY_CORRECT;
          this.trigger('entry:is_correct', this.currentIndex);
          this.currentIndex++;
          if (this.entries.length === this.currentIndex) {
            return this.trigger('game:finished');
          }
        } else {
          console.log('entry:is_incorrect', entry, this.entries[this.currentIndex]);
          this.incorrectEntries++;
          this.entriesMapStatus[this.currentIndex] = this.ENTRY_INCORRECT;
          this.trigger('entry:is_incorrect', this.currentIndex);
          return this.currentIndex++;
        }
      };

      PlayerModel.prototype.deleteEntry = function(elapsedTime) {
        if (this.currentIndex > 0) {
          this.entriesLogs.push({
            t: elapsedTime,
            v: -1
          });
          this.currentIndex--;
          console.log('entry:is_reset', this.entries[this.currentIndex]);
          if (this.entriesMapStatus[this.currentIndex] === this.ENTRY_INCORRECT) {
            this.entriesMapStatus[this.currentIndex] = this.ENTRY_TO_BE_FIXED;
          } else {
            this.entriesMapStatus[this.currentIndex] = this.ENTRY_DELETED;
          }
          return this.trigger('entry:is_reset', this.currentIndex);
        }
      };

      PlayerModel.prototype.getStats = function(elapsedTime) {
        var elapsedTimeMinutes, errorRate, rawSpeed, totalEntries;
        elapsedTimeMinutes = elapsedTime / 60000;
        totalEntries = this.correctEntries + this.incorrectEntries;
        errorRate = (this.incorrectEntries - this.fixedMistakes) / elapsedTimeMinutes;
        rawSpeed = (totalEntries / elapsedTimeMinutes) / 5;
        return {
          elapsedTime: elapsedTime,
          correctEntries: this.correctEntries,
          incorrectEntries: this.incorrectEntries,
          fixedMistakes: this.fixedMistakes,
          totalEntries: totalEntries,
          errorRate: errorRate,
          rawSpeed: rawSpeed,
          keySpeed: totalEntries / elapsedTimeMinutes,
          speed: rawSpeed - errorRate,
          accuracy: (totalEntries ? (this.correctEntries / totalEntries) * 100 : 0)
        };
      };

      PlayerModel.prototype.getRecords = function() {
        return this.entriesLogs;
      };

      PlayerModel.prototype.isCheating = function() {
        var averageInterval, equalPercent, logs, sumIntervals, totalKeystrokes;
        logs = _.pluck(this.entriesLogs, 't');
        logs = $.map(logs, function(val, i) {
          if (i === 0) {
            return null;
          }
          return val - logs[i - 1];
        });
        console.log(logs);
        logs = _.uniq(logs);
        if (logs.length) {
          totalKeystrokes = this.correctEntries + this.incorrectEntries;
          equalPercent = 100 - (parseInt(logs.length / totalKeystrokes * 100, 10));
          sumIntervals = _.reduce(logs, function(memo, num) {
            return memo + num;
          });
          averageInterval = parseInt(sumIntervals / logs.length, 10);
          console.log('Intervals equal percentage: ' + equalPercent);
          console.log('Average interval : ' + averageInterval + 'ms');
        } else {
          equalPercent = 0;
          averageInterval = NaN;
        }
        return equalPercent > 70 || averageInterval < 30;
      };

      return PlayerModel;

    })(Backbone.Model);
  });

}).call(this);
