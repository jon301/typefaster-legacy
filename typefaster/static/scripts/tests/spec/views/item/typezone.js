(function() {
  define(['jquery', 'backbone', 'app', 'controllers/game', 'views/item/typezone'], function($, Backbone, app, GameController, TypeZoneView) {
    'use strict';
    var gameController, humanPlayer, typeZoneView;
    gameController = void 0;
    humanPlayer = void 0;
    typeZoneView = void 0;
    return describe('TypeZoneView', function() {
      before(function() {
        var entries;
        entries = 'Iñtërnâtiônàlizætiøn☃💩';
        typeZoneView = new TypeZoneView({
          el: $('<div />'),
          entries: entries
        });
        typeZoneView.render();
        gameController = new GameController({
          entries: entries,
          duration: null
        });
        gameController.addHuman();
        return humanPlayer = gameController.humanPlayer;
      });
      beforeEach(function() {
        sinon.spy(app.vent, 'trigger');
        $(window).triggerHandler('focus.typezone');
        return typeZoneView.focus();
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
          return assert.isTrue(app.vent.trigger.notCalled);
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
          assert.isTrue(app.vent.trigger.notCalled, 'because typezone is not focused');
          typeZoneView.focus();
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(app.vent.trigger.called);
        });
      });
      describe('keypress', function() {
        it('should trigger `keyboard:char` event', function() {
          var e;
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 73;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(app.vent.trigger.calledWith('keyboard:char', 'I'));
        });
        return it('should handle unicode characters', function() {
          var e;
          gameController.setEntries('💩');
          e = jQuery.Event('keypress');
          e.originalEvent = true;
          e.which = 0x1F4A9;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(app.vent.trigger.calledWith('entry:is_correct', humanPlayer, 0));
        });
      });
      describe('keydown', function() {
        it('should trigger `keyboard:backspace` event on backspace keydown', function() {
          var e;
          e = jQuery.Event('keydown');
          e.originalEvent = true;
          e.which = 8;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(app.vent.trigger.calledWith('keyboard:backspace'));
        });
        return it('should trigger `keyboard:escape` event on escape keydown', function() {
          var e;
          e = jQuery.Event('keydown');
          e.originalEvent = true;
          e.which = 27;
          typeZoneView.ui.input.trigger(e);
          return assert.isTrue(app.vent.trigger.calledWith('keyboard:escape'));
        });
      });
      describe('entry:is_correct', function() {
        return it('should add `correct` class to element', function() {
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('current'));
          assert.isFalse(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          app.vent.trigger('entry:is_correct', humanPlayer, 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          return assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
        });
      });
      describe('entry:is_incorrect', function() {
        return it('should add `incorrect` class to element', function() {
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('current'));
          assert.isFalse(typeZoneView.ui.entries.eq(0).hasClass('incorrect'));
          app.vent.trigger('entry:is_incorrect', humanPlayer, 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('incorrect'));
          return assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
        });
      });
      describe('entry:is_reset', function() {
        return it('should remove all classes from current element', function() {
          app.vent.trigger('entry:is_correct', humanPlayer, 0);
          assert.isTrue(typeZoneView.ui.entries.eq(0).hasClass('correct'));
          assert.isTrue(typeZoneView.ui.entries.eq(1).hasClass('current'));
          app.vent.trigger('entry:is_reset', humanPlayer, 0);
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
        app.vent.trigger.restore();
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
