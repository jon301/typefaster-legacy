(function() {
  define(['jquery', 'backbone', 'chai', 'controllers/game'], function($, Backbone, chai, GameController) {
    'use strict';
    var assert, expect, gameController;
    expect = chai.expect;
    assert = chai.assert;
    gameController = void 0;
    return describe('PlayerHumanModel', function() {
      before(function() {
        return gameController = new GameController({
          entries: 'Iñtërnâtiônàlizætiøn☃💩',
          duration: null
        });
      });
      beforeEach(function() {});
      describe('TODO', function() {
        return it('TODO', function() {
          return assert.isTrue(true);
        });
      });
      afterEach(function() {});
      return after(function() {
        return gameController.close();
      });
    });
  });

}).call(this);
