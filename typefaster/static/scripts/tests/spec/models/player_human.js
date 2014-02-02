(function() {
  define(['jquery', 'backbone', 'app', 'controllers/game'], function($, Backbone, app, GameController) {
    'use strict';
    var gameController, humanPlayer;
    gameController = void 0;
    humanPlayer = void 0;
    return describe('PlayerHumanModel', function() {
      before(function() {
        gameController = new GameController({
          entries: 'Iñtërnâtiônàlizætiøn☃💩',
          duration: null
        });
        gameController.addHuman();
        return humanPlayer = gameController.humanPlayer;
      });
      beforeEach(function() {
        app.vent.trigger = sinon.spy(app.vent, 'trigger');
        return humanPlayer.play();
      });
      describe('typeEntry', function() {
        it('should increment current index', function() {
          humanPlayer.typeEntry('a');
          return assert.isTrue(humanPlayer.currentIndex === 1);
        });
        it('should handle correct entries', function() {
          humanPlayer.typeEntry('I');
          assert.isTrue(humanPlayer.correctEntries === 1);
          return assert.isTrue(app.vent.trigger.calledWith('entry:is_correct', humanPlayer, 0));
        });
        it('should handle incorrect entries', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          return assert.isTrue(app.vent.trigger.calledWith('entry:is_incorrect', humanPlayer, 0));
        });
        it('should handle fixed mistakes', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          assert.isTrue(humanPlayer.fixedMistakes === 0);
          assert.isTrue(humanPlayer.correctEntries === 0);
          assert.isTrue(app.vent.trigger.calledWith('entry:is_incorrect', humanPlayer, 0));
          humanPlayer.deleteEntry();
          humanPlayer.typeEntry('I');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          assert.isTrue(humanPlayer.fixedMistakes === 1);
          assert.isTrue(humanPlayer.correctEntries === 1);
          return assert.isTrue(app.vent.trigger.calledWith('entry:is_correct', humanPlayer, 0));
        });
        it('should stop the game if all entries have been typed', function() {
          var i;
          i = 0;
          while (i < 22) {
            humanPlayer.typeEntry('a');
            i++;
          }
          return assert.isTrue(app.vent.trigger.calledWith('human:stop'));
        });
        return it('should handle unicode characters', function() {
          humanPlayer.typeEntry('I');
          humanPlayer.typeEntry('ñ');
          humanPlayer.typeEntry('t');
          humanPlayer.typeEntry('ë');
          humanPlayer.typeEntry('r');
          humanPlayer.typeEntry('n');
          humanPlayer.typeEntry('â');
          humanPlayer.typeEntry('t');
          humanPlayer.typeEntry('i');
          humanPlayer.typeEntry('ô');
          humanPlayer.typeEntry('n');
          humanPlayer.typeEntry('à');
          humanPlayer.typeEntry('l');
          humanPlayer.typeEntry('i');
          humanPlayer.typeEntry('z');
          humanPlayer.typeEntry('æ');
          humanPlayer.typeEntry('t');
          humanPlayer.typeEntry('i');
          humanPlayer.typeEntry('ø');
          humanPlayer.typeEntry('n');
          humanPlayer.typeEntry('☃');
          humanPlayer.typeEntry('💩');
          return assert.isTrue(humanPlayer.correctEntries === 22);
        });
      });
      describe('deleteEntry', function() {
        it('should decrement current index', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.currentIndex === 1);
          humanPlayer.deleteEntry();
          assert.isTrue(app.vent.trigger.calledWith('entry:is_reset', humanPlayer, 0));
          return assert.isTrue(humanPlayer.currentIndex === 0);
        });
        return it('should not decrement current index if current index is 0', function() {
          humanPlayer.deleteEntry();
          humanPlayer.deleteEntry();
          return assert.isTrue(app.vent.trigger.notCalled);
        });
      });
      afterEach(function() {
        app.vent.trigger.restore();
        return humanPlayer.stop();
      });
      return after(function() {
        return gameController.close();
      });
    });
  });

}).call(this);
