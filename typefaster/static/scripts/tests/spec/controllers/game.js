(function() {
  define(['jquery', 'backbone', 'controllers/game'], function($, Backbone, GameController) {
    'use strict';
    var deleteEntrySpy, gameController, playSpy, stopSpy, timer, typeEntrySpy;
    gameController = void 0;
    timer = void 0;
    playSpy = void 0;
    stopSpy = void 0;
    typeEntrySpy = void 0;
    deleteEntrySpy = void 0;
    return describe('GameController', function() {
      before(function() {
        gameController = new GameController({
          entries: 'Hello World',
          duration: null
        });
        return gameController.addHuman();
      });
      beforeEach(function() {
        timer = sinon.useFakeTimers();
        playSpy = sinon.spy(gameController.humanPlayer, 'play');
        stopSpy = sinon.spy(gameController.humanPlayer, 'stop');
        typeEntrySpy = sinon.spy(gameController.humanPlayer, 'typeEntry');
        return deleteEntrySpy = sinon.spy(gameController.humanPlayer, 'deleteEntry');
      });
      afterEach(function() {
        gameController.stop();
        timer.restore();
        playSpy.restore();
        stopSpy.restore();
        typeEntrySpy.restore();
        return deleteEntrySpy.restore();
      });
      after(function() {
        return gameController.close();
      });
      describe('start', function() {
        return it('can be called only once', function() {
          gameController.start();
          gameController.start();
          return assert.isTrue(playSpy.calledOnce);
        });
      });
      describe('stop', function() {
        it('can be called only if started', function() {
          gameController.stop();
          return assert.isTrue(stopSpy.notCalled);
        });
        it('can be called only once', function() {
          gameController.start();
          gameController.stop();
          gameController.stop();
          return assert.isTrue(stopSpy.calledOnce);
        });
        return it('should be called after `duration` second(s) : 1 second', function() {
          var duration;
          duration = .0001;
          gameController.setDuration(duration);
          gameController.start();
          timer.tick(999);
          assert.isTrue(stopSpy.notCalled, 'not called at 999ms');
          timer.tick(1000);
          return assert.isTrue(stopSpy.called, 'called at 1000ms');
        });
      });
      return describe('on event', function() {
        describe('keyboard:char', function() {
          it('should call `typeEntry` with the char pressed', function() {
            gameController.trigger('keyboard:char', 'a');
            return assert.isTrue(typeEntrySpy.calledWith('a'));
          });
          return it('should start the game on the first char pressed only', function() {
            gameController.trigger('keyboard:char', 'a');
            gameController.trigger('keyboard:char', 'a');
            return assert.isTrue(playSpy.calledOnce);
          });
        });
        describe('keyboard:backspace', function() {
          return it('should call `deleteEntry` everytime', function() {
            gameController.trigger('keyboard:backspace');
            gameController.trigger('keyboard:backspace');
            return assert.isTrue(deleteEntrySpy.calledTwice);
          });
        });
        return describe('human:stop', function() {
          return it('should stop the game', function() {
            gameController.start();
            gameController.trigger('human:stop');
            return assert.isTrue(stopSpy.called);
          });
        });
      });
    });
  });

}).call(this);
