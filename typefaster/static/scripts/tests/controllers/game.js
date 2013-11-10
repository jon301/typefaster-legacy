(function() {
  define(['jquery', 'backbone', 'chai', 'controllers/game'], function($, Backbone, chai, GameController) {
    'use strict';
    var assert, expect, gameController;
    expect = chai.expect;
    assert = chai.assert;
    gameController = null;
    return describe('GameController', function() {
      before(function() {});
      beforeEach(function() {
        return gameController = new GameController({
          entries: 'Iñtërnâtiônàlizætiøn☃💩',
          duration: null
        });
      });
      describe('initialize', function() {});
      describe('start', function() {
        return it('can be called only once', function() {
          var play;
          play = sinon.spy();
          gameController.humanPlayer.play = play;
          gameController.start();
          gameController.start();
          return assert.isTrue(play.calledOnce);
        });
      });
      describe('stop', function() {
        it('can be called only once', function() {
          var stop;
          gameController.start();
          stop = sinon.spy();
          gameController.humanPlayer.stop = stop;
          gameController.stop();
          gameController.stop();
          return assert.isTrue(stop.calledOnce);
        });
        it('can be called only if started', function() {
          var stop;
          stop = sinon.spy();
          gameController.humanPlayer.stop = stop;
          gameController.stop();
          return assert.isTrue(stop.notCalled);
        });
        return it('should be called after 1s', function(done) {
          var duration, stop;
          duration = 1;
          gameController.setDuration(duration);
          stop = sinon.spy();
          gameController.humanPlayer.stop = stop;
          gameController.start();
          assert.isTrue(stop.notCalled);
          return setTimeout(function() {
            assert.isTrue(stop.called);
            return done();
          }, 1000);
        });
      });
      return afterEach(function() {
        gameController.stop();
        return gameController.close();
      });
    });
  });

}).call(this);
