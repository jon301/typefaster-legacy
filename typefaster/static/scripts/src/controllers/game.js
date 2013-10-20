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

    http://jsfiddle.net/v7GN3/
    $(window).resize(function() { $('#type-inner').scrollTop($('#type-inner').scrollTop() + $('#titi').position().top); });
*/


/*
    To begin a new game :
        gameController = new GameController(
            entries: "hello world"
            timer: 60
        )

    Make game listening for keyboard events
        gameController.listen();

    Optionally start the game manually
        gameController.start();

    Game will automatically stop when timer is over or everything has been typed
    Or you can stop it manually :
        gameController.stop();

    Optionally change game settings
        gameController.setTimer(30);
        gameController.setEntries('hello sick world');

    Start over
        gameController.listen();
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["jquery", "underscore", "marionette"], function($, _, Marionette) {
    "use strict";
    var ENTRY_CORRECT, ENTRY_DELETED, ENTRY_INCORRECT, ENTRY_TO_BE_FIXED, GameController, _ref;
    ENTRY_CORRECT = 1;
    ENTRY_INCORRECT = -1;
    ENTRY_TO_BE_FIXED = 0;
    ENTRY_DELETED = 2;
    return GameController = (function(_super) {
      __extends(GameController, _super);

      function GameController() {
        _ref = GameController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GameController.prototype.entries = '';

      GameController.prototype.timer = 60;

      GameController.prototype.reset = function() {
        this.correctEntries = 0;
        this.incorrectEntries = 0;
        this.fixedMistakes = 0;
        this.currentIndex = 0;
        this.startTime = null;
        this.stopTime = null;
        this.entriesMapStatus = [];
        return this.entriesLogs = [];
      };

      GameController.prototype.initialize = function(options) {
        this.timer = options.timer;
        return this.entries = options.entries;
      };

      GameController.prototype.listen = function() {
        var _this = this;
        if (!this.listening) {
          this.reset();
          this.listening = true;
          console.log('You have ' + this.timer + ' seconds to type :' + this.entries);
          this.listenTo(this, 'entry:typed', function(entry) {
            _this.start();
            if (entry === _this.entries[_this.currentIndex]) {
              console.log('entry:is_correct', entry, _this.entries[_this.currentIndex]);
              _this.correctEntries++;
              if (_this.entriesMapStatus[_this.currentIndex] === ENTRY_TO_BE_FIXED) {
                _this.fixedMistakes++;
              }
              _this.entriesMapStatus[_this.currentIndex] = ENTRY_CORRECT;
              _this.trigger('entry:is_correct', _this.currentIndex);
              _this.currentIndex++;
              _this.entriesLogs.push({
                ts: new Date().getTime(),
                v: ENTRY_CORRECT
              });
              if (_this.entries.length === _this.currentIndex) {
                return _this.stop();
              }
            } else {
              console.log('entry:is_incorrect', entry, _this.entries[_this.currentIndex]);
              _this.incorrectEntries++;
              _this.entriesMapStatus[_this.currentIndex] = ENTRY_INCORRECT;
              _this.trigger('entry:is_incorrect', _this.currentIndex);
              _this.currentIndex++;
              return _this.entriesLogs.push({
                ts: new Date().getTime(),
                v: ENTRY_INCORRECT
              });
            }
          });
          return this.listenTo(this, 'entry:deleted', function() {
            if (_this.currentIndex > 0) {
              _this.currentIndex--;
              console.log('entry:is_reset', _this.entries[_this.currentIndex]);
              if (_this.entriesMapStatus[_this.currentIndex] === ENTRY_INCORRECT) {
                _this.entriesMapStatus[_this.currentIndex] = ENTRY_TO_BE_FIXED;
              } else {
                _this.entriesMapStatus[_this.currentIndex] = ENTRY_DELETED;
              }
              _this.trigger('entry:is_reset', _this.currentIndex);
              return _this.entriesLogs.push({
                ts: new Date().getTime(),
                v: ENTRY_DELETED
              });
            }
          });
        }
      };

      GameController.prototype.start = function() {
        var timer,
          _this = this;
        if (!this.running && this.listening) {
          console.log('Game started');
          this.running = true;
          this.startTime = new Date().getTime();
          timer = this.timer;
          timer--;
          return this.interval = setInterval(function() {
            if (timer > 0) {
              timer--;
            } else {
              _this.stop();
            }
            return _this.trigger('game:stats', _this.stats());
          }, 1000);
        }
      };

      GameController.prototype.stop = function() {
        if (this.running) {
          console.log('Game stopped');
          this.stopTime = new Date().getTime();
          clearInterval(this.interval);
          this.stopListening();
          this.running = false;
          this.listening = false;
          console.log(this.stats());
          if (this.cheating()) {
            return console.log('You are a cheater');
          } else {
            return console.log('You are not a cheater');
          }
        }
      };

      GameController.prototype.stats = function() {
        var currentTime, elapsedTime, elapsedTimeMinutes, errorRate, rawSpeed, totalEntries;
        if (this.stopTime) {
          currentTime = this.stopTime;
        } else {
          currentTime = (new Date).getTime();
        }
        elapsedTime = this.startTime ? (currentTime - this.startTime) / 1000 : 0;
        elapsedTimeMinutes = (Math.ceil(elapsedTime)) / 60;
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

      GameController.prototype.cheating = function() {
        var averageInterval, equalPercent, logs, sumIntervals, totalKeystrokes;
        logs = _.pluck(this.entriesLogs, 'ts');
        logs = $.map(logs, function(val, i) {
          if (i === 0) {
            return null;
          }
          return val - logs[i - 1];
        });
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

      GameController.prototype.setEntries = function(entries) {
        if (!this.running) {
          if (entries) {
            this.entries = entries;
          }
          return console.log('You have ' + this.timer + ' seconds to type :' + this.entries);
        }
      };

      GameController.prototype.setTimer = function(timer) {
        if (!this.running) {
          if (timer) {
            this.timer = timer;
          }
          return console.log('You have ' + this.timer + ' seconds to type :' + this.entries);
        }
      };

      return GameController;

    })(Marionette.Controller);
  });

}).call(this);
