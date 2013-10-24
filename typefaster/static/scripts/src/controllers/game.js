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

  define(["jquery", "underscore", "marionette", "backbone", "models/player", "models/ghost", "controllers/timer"], function($, _, Marionette, Backbone, PlayerModel, GhostModel, TimerController) {
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
        return this.timerController.reset();
      };

      GameController.prototype.initialize = function(options) {
        var _this = this;
        this.timer = options.timer;
        this.entries = options.entries;
        this.player = new PlayerModel({
          entries: options.entries
        });
        this.ghostCollection = new Backbone.Collection();
        window.ghostCollection = this.ghostCollection;
        this.timerController = new TimerController();
        $(window).focus(function() {
          console.log('focus : bind listen events');
          return _this.bindEvents();
        });
        return $(window).blur(function() {
          console.log('blur : unbind listen events');
          return _this.off();
        });
      };

      GameController.prototype.bindEvents = function() {
        var _this = this;
        this.on('entry:typed', function(entry) {
          return _this.player.typeEntry(entry, _this.timerController.getElapsedTime());
        });
        this.on('entry:deleted', function() {
          return _this.player.deleteEntry(_this.timerController.getElapsedTime());
        });
        return this.player.on('game:finished', function() {
          return _this.stop();
        });
      };

      GameController.prototype.listen = function() {
        if (!this.listening) {
          this.listening = true;
          if (this.timer) {
            console.log('You have ' + this.timer + ' seconds to type :' + this.entries);
          }
          return this.bindEvents();
        }
      };

      GameController.prototype.start = function() {
        var timer,
          _this = this;
        if (!this.running) {
          console.log('Game started');
          this.running = true;
          this.timerController.start();
          this.ghostCollection.invoke('run');
          if (this.timer) {
            timer = this.timer - 1;
          }
          return this.interval = setInterval(function() {
            if (_this.timer) {
              if (timer > 0) {
                timer--;
              } else {
                _this.stop();
              }
            }
            return _this.trigger('game:stats', _this.player.getStats(_this.timerController.getElapsedTime()));
          }, 1000);
        }
      };

      GameController.prototype.stop = function() {
        if (this.running) {
          console.log('Game stopped');
          this.timerController.stop();
          clearInterval(this.interval);
          this.off();
          this.running = false;
          this.listening = false;
          if (this.player.isCheating()) {
            console.log('You are a cheater');
          } else {
            console.log('You are not a cheater');
          }
          console.log(JSON.stringify(this.player.getStats(this.timerController.getElapsedTime())));
          return console.log(JSON.stringify(this.player.getRecords()));
        }
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

      GameController.prototype.addGhost = function(entriesLogs) {
        return this.ghostCollection.add(new GhostModel({
          entries: this.entries,
          entriesLogs: entriesLogs
        }));
      };

      return GameController;

    })(Marionette.Controller);
  });

}).call(this);
