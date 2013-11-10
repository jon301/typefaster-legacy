(function() {
  define(['jquery', 'backbone', 'chai', 'controllers/game'], function($, Backbone, chai, GameController) {
    'use strict';
    var assert, deleteEntrySpy, expect, gameController, playSpy, stopSpy, timer, typeEntrySpy;
    expect = chai.expect;
    assert = chai.assert;
    gameController = void 0;
    timer = void 0;
    playSpy = void 0;
    stopSpy = void 0;
    typeEntrySpy = void 0;
    deleteEntrySpy = void 0;
    return describe('GameController', function() {
      before(function() {
        return gameController = new GameController({
          entries: 'Hello World',
          duration: null
        });
      });
      beforeEach(function() {
        timer = sinon.useFakeTimers();
        playSpy = sinon.spy(gameController.humanPlayer, 'play');
        stopSpy = sinon.spy(gameController.humanPlayer, 'stop');
        typeEntrySpy = sinon.spy(gameController.humanPlayer, 'typeEntry');
        return deleteEntrySpy = sinon.spy(gameController.humanPlayer, 'deleteEntry');
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
        it('should be called after `duration` second(s) : 1 second', function() {
          var duration;
          duration = .001;
          gameController.setDuration(duration);
          gameController.start();
          timer.tick(999);
          assert.isTrue(stopSpy.notCalled, 'not called at 999ms');
          timer.tick(1000);
          return assert.isTrue(stopSpy.called, 'called at 1000ms');
        });
        return it('should stop event listening', function() {
          gameController.startListen();
          gameController.trigger('entry:typed', 'a');
          gameController.stop();
          gameController.trigger('entry:typed', 'a');
          return assert.isTrue(typeEntrySpy.calledOnce);
        });
      });
      describe('startListen', function() {
        beforeEach(function() {
          return gameController.startListen();
        });
        describe('entry:typed', function() {
          it('should call `typeEntry` with the entry typed', function() {
            gameController.trigger('entry:typed', 'a');
            return assert.isTrue(typeEntrySpy.calledWith('a'));
          });
          return it('should start the game on the first entry typed only', function() {
            gameController.trigger('entry:typed', 'a');
            gameController.trigger('entry:typed', 'a');
            return assert.isTrue(playSpy.calledOnce);
          });
        });
        describe('entry:deleted', function() {
          return it('should call `deleteEntry` everytime', function() {
            gameController.trigger('entry:deleted');
            gameController.trigger('entry:deleted');
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
      describe('stopListen', function() {
        beforeEach(function() {
          return gameController.startListen();
        });
        return it('should prevent all callbacks to be triggered', function() {
          gameController.stopListen();
          gameController.trigger('entry:typed', 'a');
          gameController.trigger('entry:deleted');
          gameController.trigger('human:stop');
          assert.isTrue(typeEntrySpy.notCalled);
          assert.isTrue(deleteEntrySpy.notCalled);
          return assert.isTrue(stopSpy.notCalled);
        });
      });
      afterEach(function() {
        gameController.stop();
        timer.restore();
        playSpy.restore();
        stopSpy.restore();
        typeEntrySpy.restore();
        return deleteEntrySpy.restore();
      });
      return after(function() {
        return gameController.close();
      });
    });
  });

}).call(this);
