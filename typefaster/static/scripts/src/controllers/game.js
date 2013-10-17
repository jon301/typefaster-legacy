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


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["jquery", "marionette"], function($, Marionette) {
    "use strict";
    var ENTRY_CORRECT, ENTRY_INCORRECT, ENTRY_TO_BE_FIXED, GameController, _ref;
    ENTRY_CORRECT = 1;
    ENTRY_INCORRECT = -1;
    ENTRY_TO_BE_FIXED = 0;
    return GameController = (function(_super) {
      __extends(GameController, _super);

      function GameController() {
        _ref = GameController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GameController.prototype.entries = '';

      GameController.prototype.timer = 60;

      GameController.prototype.entriesMapStatus = [];

      GameController.prototype.initialize = function(options) {
        this.reset();
        this.timer(options.timer);
        this.entries(options.entries);
        console.log('You have ' + this.timer + ' to type :' + this.entries);
        return this.listen();
      };

      GameController.prototype.listen = function() {
        var _this = this;
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
            if (_this.entries.length === _this.currentIndex) {
              return _this.stop();
            }
          } else {
            console.log('entry:is_incorrect', entry, _this.entries[_this.currentIndex]);
            _this.incorrectEntries++;
            _this.entriesMapStatus[_this.currentIndex] = ENTRY_INCORRECT;
            _this.trigger('entry:is_incorrect', _this.currentIndex);
            return _this.currentIndex++;
          }
        });
        return this.listenTo(this, 'entry:deleted', function() {
          if (_this.currentIndex > 0) {
            _this.currentIndex--;
            console.log('entry:is_reset', _this.entries[_this.currentIndex]);
            if (_this.entriesMapStatus[_this.currentIndex] === ENTRY_INCORRECT) {
              _this.entriesMapStatus[_this.currentIndex] = ENTRY_TO_BE_FIXED;
            }
            return _this.trigger('entry:is_reset', _this.currentIndex);
          }
        });
      };

      GameController.prototype.start = function() {
        var timer,
          _this = this;
        if (!this.running) {
          console.log('Game started');
          this.running = true;
          this.startTime = new Date().getTime();
          timer = this.timer;
          return this.interval = setInterval(function() {
            if (timer > 0) {
              return timer--;
            } else {
              return _this.stop();
            }
          }, 1000);
        }
      };

      GameController.prototype.stop = function() {
        console.log('Game stopped');
        this.running = false;
        this.stopTime = new Date().getTime();
        clearInterval(this.interval);
        this.stopListening();
        return console.log(this.stats());
      };

      GameController.prototype.stats = function() {
        var elapsedTime, errorRate, rawSpeed, timerMinutes, totalEntries;
        elapsedTime = Math.ceil((this.stopTime - this.startTime) / 1000);
        timerMinutes = elapsedTime / 60;
        totalEntries = this.correctEntries + this.incorrectEntries;
        errorRate = (this.incorrectEntries - this.fixedMistakes) / timerMinutes;
        rawSpeed = (totalEntries / timerMinutes) / 5;
        return {
          correctEntries: this.correctEntries,
          incorrectEntries: this.incorrectEntries,
          fixedMistakes: this.fixedMistakes,
          totalEntries: totalEntries,
          errorRate: errorRate,
          rawSpeed: rawSpeed,
          keySpeed: totalEntries / timerMinutes,
          speed: rawSpeed - errorRate,
          accuracy: (this.correctEntries / totalEntries) * 100
        };
      };

      GameController.prototype.reset = function() {
        this.currentIndex = 0;
        this.correctEntries = 0;
        this.incorrectEntries = 0;
        this.fixedMistakes = 0;
        return this.entriesMapStatus = [];
      };

      GameController.prototype.entries = function(entries) {
        if (entries) {
          this.entries = entries;
        }
        return this.entries;
      };

      GameController.prototype.timer = function(timer) {
        if (timer) {
          this.timer = timer;
        }
        return this.timer;
      };

      return GameController;

    })(Marionette.Controller);
  });

}).call(this);
