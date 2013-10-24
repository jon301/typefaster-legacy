(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "models/player", "controllers/timer"], function($, _, PlayerModel, TimerController) {
    "use strict";
    var GhostModel, _ref;
    return GhostModel = (function(_super) {
      __extends(GhostModel, _super);

      function GhostModel() {
        _ref = GhostModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GhostModel.prototype.elapsedTime = 0;

      GhostModel.prototype.timeout = null;

      GhostModel.prototype.initialize = function(options) {
        this.entries = options.entries;
        this.entriesLogs = options.entriesLogs;
        return this.timer = new TimerController();
      };

      GhostModel.prototype.run = function() {
        this.timer.start();
        return this.readEntries();
      };

      GhostModel.prototype.stop = function() {
        console.log('stop');
        clearTimeout(this.timeout);
        if (this.isCheating()) {
          console.log('This ghost is a cheater');
        } else {
          console.log('This ghost is not a cheater');
        }
        return console.log(JSON.stringify(this.getStats()));
      };

      GhostModel.prototype.readEntries = function() {
        if (!this.entryLog) {
          this.entryLog = this.entriesLogs.shift();
        }
        if (this.timer.getElapsedTime() > this.entryLog.t) {
          if (this.entryLog.v === -1) {
            this.deleteEntry();
          } else {
            this.typeEntry(this.entryLog.v);
          }
          this.entryLog = this.entriesLogs.shift();
        }
        if (this.entryLog) {
          return this.timeout = setTimeout($.proxy(this.readEntries, this), 1);
        }
      };

      GhostModel.prototype.typeEntry = function(entry) {
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
            return this.stop();
          }
        } else {
          console.log('entry:is_incorrect', entry, this.entries[this.currentIndex]);
          this.incorrectEntries++;
          this.entriesMapStatus[this.currentIndex] = this.ENTRY_INCORRECT;
          this.trigger('entry:is_incorrect', this.currentIndex);
          return this.currentIndex++;
        }
      };

      GhostModel.prototype.deleteEntry = function() {
        if (this.currentIndex > 0) {
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

      GhostModel.prototype.getStats = function() {
        var elapsedTime, elapsedTimeMinutes, errorRate, rawSpeed, totalEntries;
        elapsedTime = this.timer.getElapsedTime();
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

      GhostModel.prototype.isCheating = function() {
        var averageInterval, equalPercent, logs, sumIntervals, totalKeystrokes;
        logs = _.keys(this.entriesLogs);
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

      return GhostModel;

    })(PlayerModel);
  });

}).call(this);
