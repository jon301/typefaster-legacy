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
            entries: 'hello world'
            duration: 60
        )

    Make game listening for keyboard events
        gameController.listen();

    Optionally start the game manually
        gameController.start();

    Game will automatically stop when time is over or everything has been typed
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

  define(['jquery', 'underscore', 'backbone', 'marionette', 'controllers/timer', 'models/player_human', 'models/player_ghost'], function($, _, Backbone, Marionette, TimerController, PlayerHumanModel, PlayerGhostModel) {
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

      GameController.prototype.initialize = function(options) {
        var _this = this;
        this.duration = options.duration;
        this.entries = options.entries;
        this.humanPlayer = new PlayerHumanModel({
          entries: options.entries,
          gameController: this
        });
        this.ghostPlayers = new Backbone.Collection();
        this.timer = new TimerController();
        $(window).focus(function() {
          console.log('focus : bind listen events');
          return _this.startListening();
        });
        return $(window).blur(function() {
          console.log('blur : unbind listen events');
          _this.listening = false;
          return _this.stopListening();
        });
      };

      GameController.prototype.startListening = function() {
        var _this = this;
        if (!this.listening) {
          this.listening = true;
          this.listenTo(this, 'entry:typed', function(entry) {
            return _this.humanPlayer.typeEntry(entry);
          });
          this.listenTo(this, 'entry:deleted', function() {
            return _this.humanPlayer.deleteEntry();
          });
          this.listenTo(this.humanPlayer, 'human:stop', function() {
            return _this.stop();
          });
          if (this.duration) {
            return console.log('You have ' + this.duration + ' seconds to type :' + this.entries);
          } else {
            return console.log('You have unlimited time to type : ' + this(entries));
          }
        }
      };

      GameController.prototype.start = function() {
        var _this = this;
        if (!this.running) {
          console.log('Game started');
          this.running = true;
          this.humanPlayer.play();
          this.ghostPlayers.invoke('play');
          if (this.duration) {
            this.timer.start();
            return this.interval = setInterval(function() {
              if (_this.timer.getElapsedTime() >= _this.duration * 1000) {
                _this.timer.stop();
                _this.stop();
              }
              return _this.trigger('human:stats', _this.humanPlayer.getStats());
            }, 1000);
          }
        }
      };

      GameController.prototype.stop = function() {
        if (this.running) {
          console.log('Game stopped');
          clearInterval(this.interval);
          return this.stopListening();
        }
      };

      GameController.prototype.reset = function() {};

      GameController.prototype.setEntries = function(entries) {
        if (!this.running) {
          if (entries) {
            this.entries = entries;
          }
          return console.log('You have ' + this.duration + ' seconds to type :' + this.entries);
        }
      };

      GameController.prototype.setDuration = function(duration) {
        if (!this.running) {
          if (duration) {
            this.duration = duration;
          }
          return console.log('You have ' + this.duration + ' seconds to type :' + this.entries);
        }
      };

      GameController.prototype.addGhost = function(replayLogs) {
        if (!this.running) {
          return this.ghostPlayers.add(new PlayerGhostModel({
            entries: this.entries,
            replayLogs: replayLogs,
            gameController: this
          }));
        }
      };

      return GameController;

    })(Marionette.Controller);
  });

}).call(this);
