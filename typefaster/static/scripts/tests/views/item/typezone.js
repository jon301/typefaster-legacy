(function() {
  define(['jquery', 'backbone', 'chai', 'controllers/game', 'views/item/typezone'], function($, Backbone, chai, GameController, TypeZoneView) {
    'use strict';
    var assert, expect, gameController, typeZoneView;
    expect = chai.expect;
    assert = chai.assert;
    gameController = void 0;
    typeZoneView = void 0;
    return describe('TypeZoneView', function() {
      before(function() {
        var entries;
        entries = 'Iñtërnâtiônàlizætiøn☃💩';
        gameController = new GameController({
          entries: entries,
          duration: null
        });
        typeZoneView = new TypeZoneView({
          el: $('<div />'),
          gameController: gameController
        });
        return typeZoneView.render();
      });
      beforeEach(function() {
        sinon.spy(gameController, 'trigger');
        $(window).triggerHandler('focus.typezone');
        typeZoneView.focus();
        return gameController.startListen();
      });
      describe('blur', function() {
        it('should be called on window blur', function() {
          sinon.spy(typeZoneView, 'blur');
          $(window).triggerHandler('blur.typezone');
          assert.isTrue(typeZoneView.blur.called);
          return typeZoneView.blur.restore();
        });
        return it('should prevent event listening', function() {
          var e;
          $(window).triggerHandler('blur.typezone');
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 73;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.notCalled);
        });
      });
      describe('focus', function() {
        return it('should enable event listening', function() {
          var e;
          $(window).triggerHandler('blur.typezone');
          $(window).triggerHandler('focus.typezone');
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 73;
          typeZoneView.ui.input.trigger(e);
          assert.isTrue(gameController.trigger.notCalled, 'because typezone is not focused');
          typeZoneView.focus();
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.called);
        });
      });
      describe('keypress', function() {
        it('should trigger `entry:typed` event', function() {
          var e;
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 73;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.calledWith('entry:typed', 'I'));
        });
        return it('should handle unicode characters', function() {
          var e;
          gameController.setEntries('💩');
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 0x1F4A9;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.calledWith('entry:is_correct', 0));
        });
      });
      describe('keydown', function() {
        it('should trigger `entry:delete` event on backspace keydown', function() {
          var e;
          e = jQuery.Event('keydown');
          e.originalEvent = true;
          e.which = 8;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.calledWith('entry:deleted'));
        });
        return it('should trigger `human:reset` event on escape keydown', function() {
          var e;
          e = jQuery.Event('keydown');
          e.originalEvent = true;
          e.which = 27;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(gameController.trigger.calledWith('human:reset'));
        });
      });
      describe('entry:is_correct', function() {
        return it('should add `correct` class to element', function() {
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('current'));
          assert.isFalse(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          gameController.trigger('entry:is_correct', 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          return assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
        });
      });
      describe('entry:is_incorrect', function() {
        return it('should add `incorrect` class to element', function() {
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('current'));
          assert.isFalse(typeZoneView.ui.entries.eq(0).hasClass('incorrect'));
          gameController.trigger('entry:is_incorrect', 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('incorrect'));
          return assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
        });
      });
      describe('entry:is_reset', function() {
        return it('should remove all classes from current element', function() {
          gameController.trigger('entry:is_correct', 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
          gameController.trigger('entry:is_reset', 0);
          assert.isFalse(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          assert.isFalse(typeZoneView.ui.entries.eq(1).hasClass('current'));
          return assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('current'));
        });
      });
      describe('human:stop', function() {
        return it('should blur the type zone', function() {
          sinon.spy(typeZoneView, 'blur');
          $(window).triggerHandler('blur.typezone');
          assert.isTrue(typeZoneView.blur.called);
          return typeZoneView.blur.restore();
        });
      });
      afterEach(function() {
        gameController.trigger.restore();
        gameController.stop();
        return typeZoneView.reset();
      });
      return after(function() {
        gameController.close();
        return typeZoneView.close();
      });
    });
  });

}).call(this);
