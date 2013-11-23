(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'js_logger', 'controllers/timer', 'punycode', 'string_at'], function($, _, Backbone, Logger, TimerController, punycode) {
    'use strict';
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

      PlayerModel.prototype.entriesMap = [];

      PlayerModel.prototype.initialize = function(options) {
        this.logger = Logger.get('PlayerModel');
        this.gameController = options.gameController;
        return this.timer = new TimerController();
      };

      PlayerModel.prototype.play = function() {
        this.reset();
        return this.timer.start();
      };

      PlayerModel.prototype.stop = function() {
        this.timer.stop();
        if (this.hasCheated()) {
          this.logger.debug('You are a cheater');
        } else {
          this.logger.debug('You are not a cheater');
        }
        return this.logger.debug(JSON.stringify(this.getStats()));
      };

      PlayerModel.prototype.reset = function() {
        this.correctEntries = 0;
        this.incorrectEntries = 0;
        this.fixedMistakes = 0;
        this.currentIndex = 0;
        return this.entriesMap = [];
      };

      PlayerModel.prototype.typeEntry = function(entry) {
        if (entry === this.gameController.entries.at(this.currentIndex)) {
          this.logger.debug('entry:is_correct', entry, this.gameController.entries.at(this.currentIndex));
          this.correctEntries++;
          if (this.entriesMap[this.currentIndex] === this.ENTRY_TO_BE_FIXED) {
            this.fixedMistakes++;
          }
          this.entriesMap[this.currentIndex] = this.ENTRY_CORRECT;
          this.gameController.trigger('entry:is_correct', this, this.currentIndex);
        } else {
          this.logger.debug('entry:is_incorrect', entry, this.gameController.entries.at(this.currentIndex));
          this.incorrectEntries++;
          this.entriesMap[this.currentIndex] = this.ENTRY_INCORRECT;
          this.gameController.trigger('entry:is_incorrect', this, this.currentIndex);
        }
        this.currentIndex++;
        if (punycode.ucs2.decode(this.gameController.entries).length === this.currentIndex) {
          return this.stop();
        }
      };

      PlayerModel.prototype.deleteEntry = function() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.logger.debug('entry:is_reset', this.gameController.entries.at(this.currentIndex));
          if (this.entriesMap[this.currentIndex] === this.ENTRY_INCORRECT) {
            this.entriesMap[this.currentIndex] = this.ENTRY_TO_BE_FIXED;
          } else {
            this.entriesMap[this.currentIndex] = this.ENTRY_DELETED;
          }
          this.gameController.trigger('entry:is_reset', this, this.currentIndex);
          return true;
        }
        return false;
      };

      PlayerModel.prototype.getStats = function() {
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

      PlayerModel.prototype.hasCheated = function() {
        var averageInterval, equalPercent, intervals, sumIntervals, totalKeystrokes;
        if (this.replayLogs) {
          intervals = _.pluck(this.replayLogs, 't');
          intervals = $.map(intervals, function(val, i) {
            if (i === 0) {
              return null;
            }
            return val - intervals[i - 1];
          });
          this.logger.debug(intervals);
          intervals = _.uniq(intervals);
          if (intervals.length) {
            totalKeystrokes = this.correctEntries + this.incorrectEntries;
            equalPercent = 100 - (parseInt(intervals.length / totalKeystrokes * 100, 10));
            sumIntervals = _.reduce(intervals, function(memo, num) {
              return memo + num;
            });
            averageInterval = parseInt(sumIntervals / intervals.length, 10);
            this.logger.debug('Intervals equal percentage: ' + equalPercent);
            this.logger.debug('Average interval : ' + averageInterval + 'ms');
          } else {
            equalPercent = 0;
            averageInterval = NaN;
          }
          return equalPercent > 70 || averageInterval < 50;
        }
      };

      return PlayerModel;

    })(Backbone.Model);
  });

}).call(this);
