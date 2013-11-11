(function() {
  define(['jquery', 'backbone', 'chai', 'controllers/game'], function($, Backbone, chai, GameController) {
    'use strict';
    var assert, expect, gameController, humanPlayer, triggerSpy;
    expect = chai.expect;
    assert = chai.assert;
    gameController = void 0;
    humanPlayer = void 0;
    triggerSpy = void 0;
    return describe('PlayerHumanModel', function() {
      before(function() {
        gameController = new GameController({
          entries: 'Iñtërnâtiônàlizætiøn☃💩',
          duration: null
        });
        return humanPlayer = gameController.humanPlayer;
      });
      beforeEach(function() {
        triggerSpy = sinon.spy(gameController, 'trigger');
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
          return assert.isTrue(triggerSpy.calledWith('entry:is_correct', 0));
        });
        it('should handle incorrect entries', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          return assert.isTrue(triggerSpy.calledWith('entry:is_incorrect', 0));
        });
        it('should handle fixed mistakes', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          assert.isTrue(humanPlayer.fixedMistakes === 0);
          assert.isTrue(humanPlayer.correctEntries === 0);
          assert.isTrue(triggerSpy.calledWith('entry:is_incorrect', 0));
          humanPlayer.deleteEntry();
          humanPlayer.typeEntry('I');
          assert.isTrue(humanPlayer.incorrectEntries === 1);
          assert.isTrue(humanPlayer.fixedMistakes === 1);
          assert.isTrue(humanPlayer.correctEntries === 1);
          return assert.isTrue(triggerSpy.calledWith('entry:is_correct', 0));
        });
        return it('should stop the game if all entries have been typed', function() {
          var i;
          i = 0;
          while (i < 22) {
            humanPlayer.typeEntry('a');
            i++;
          }
          return assert.isTrue(triggerSpy.calledWith('human:stop'));
        });
      });
      describe('deleteEntry', function() {
        it('should decrement current index', function() {
          humanPlayer.typeEntry('a');
          assert.isTrue(humanPlayer.currentIndex === 1);
          humanPlayer.deleteEntry();
          assert.isTrue(triggerSpy.calledWith('entry:is_reset', 0));
          return assert.isTrue(humanPlayer.currentIndex === 0);
        });
        return it('should not decrement current index if current index is 0', function() {
          humanPlayer.deleteEntry();
          humanPlayer.deleteEntry();
          return assert.isTrue(triggerSpy.notCalled);
        });
      });
      afterEach(function() {
        triggerSpy.restore();
        return humanPlayer.stop();
      });
      return after(function() {
        return gameController.close();
      });
    });
  });

}).call(this);
