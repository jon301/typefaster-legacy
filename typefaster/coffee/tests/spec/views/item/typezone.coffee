#global define
define [
    'jquery',
    'backbone',
    'app',
    'controllers/game'
    'views/item/typezone'
    ], ($, Backbone, app, GameController, TypeZoneView) ->
    'use strict'

    gameController = undefined
    humanPlayer = undefined
    typeZoneView = undefined

    describe 'TypeZoneView', ->

        before () ->
            entries = 'Iñtërnâtiônàlizætiøn☃💩'

            typeZoneView = new TypeZoneView(
                el: $('<div />')
                entries: entries
            )
            typeZoneView.render()

            gameController = new GameController(
                entries: entries
                duration: null
            )
            gameController.addHuman()
            humanPlayer = gameController.humanPlayer

        beforeEach () ->
            sinon.spy(app.vent, 'trigger')
            $(window).triggerHandler('focus.typezone')
            typeZoneView.focus()

        describe 'blur', ->
            it 'should be called on window blur', ->
                sinon.spy(typeZoneView, 'blur')
                $(window).triggerHandler('blur.typezone')
                assert.isTrue typeZoneView.blur.called
                typeZoneView.blur.restore()

            it 'should prevent event listening', ->
                $(window).triggerHandler('blur.typezone')
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 73
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.notCalled

        describe 'focus', ->
            it 'should enable event listening', ->
                $(window).triggerHandler('blur.typezone')
                $(window).triggerHandler('focus.typezone')
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 73
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.notCalled, 'because typezone is not focused'
                typeZoneView.focus()
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.called

        describe 'keypress', ->
            it 'should trigger `keyboard:char` event', ->
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 73
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.calledWith('keyboard:char', 'I')

            it 'should handle unicode characters', ->
                gameController.setEntries '💩'
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 0x1F4A9
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.calledWith('entry:is_correct', humanPlayer, 0)

        describe 'keydown', ->
            it 'should trigger `keyboard:backspace` event on backspace keydown', ->
                e = jQuery.Event 'keydown'
                e.originalEvent = true
                e.which = 8
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.calledWith('keyboard:backspace')

            it 'should trigger `keyboard:escape` event on escape keydown', ->
                e = jQuery.Event 'keydown'
                e.originalEvent = true
                e.which = 27
                typeZoneView.ui.input.trigger e
                assert.isTrue app.vent.trigger.calledWith('keyboard:escape')

        describe 'entry:is_correct', ->
            it 'should add `correct` class to element', ->
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('correct')
                app.vent.trigger 'entry:is_correct', humanPlayer, 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')

        describe 'entry:is_incorrect', ->
            it 'should add `incorrect` class to element', ->
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('incorrect')
                app.vent.trigger 'entry:is_incorrect', humanPlayer, 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('incorrect')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')

        describe 'entry:is_reset', ->
            it 'should remove all classes from current element', ->
                app.vent.trigger 'entry:is_correct', humanPlayer, 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')
                app.vent.trigger 'entry:is_reset', humanPlayer, 0
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isFalse typeZoneView.ui.entries.eq(1).hasClass('current')
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')

        describe 'human:stop', ->

            it 'should blur the type zone', ->
                sinon.spy(typeZoneView, 'blur')
                $(window).triggerHandler('blur.typezone')
                assert.isTrue typeZoneView.blur.called
                typeZoneView.blur.restore()

        afterEach () ->
            app.vent.trigger.restore()
            gameController.stop()
            typeZoneView.reset()

        after () ->
            gameController.close()
            typeZoneView.close()
