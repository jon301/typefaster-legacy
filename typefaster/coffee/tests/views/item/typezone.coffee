#global define
define [
    'jquery',
    'backbone',
    'chai',
    'controllers/game'
    'views/item/typezone'
    ], ($, Backbone, chai, GameController, TypeZoneView) ->
    'use strict'

    expect = chai.expect
    assert = chai.assert

    gameController = undefined
    typeZoneView = undefined

    describe 'TypeZoneView', ->

        before () ->
            entries = 'Iñtërnâtiônàlizætiøn☃💩'
            gameController = new GameController(
                entries: entries
                duration: null
            )

            typeZoneView = new TypeZoneView(
                el: $('<div />')
                gameController: gameController
            )
            typeZoneView.render()

        beforeEach () ->
            sinon.spy(gameController, 'trigger')
            $(window).triggerHandler('focus.typezone')
            typeZoneView.focus()
            gameController.startListen()

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
                assert.isTrue gameController.trigger.notCalled

        describe 'focus', ->
            it 'should enable event listening', ->
                $(window).triggerHandler('blur.typezone')
                $(window).triggerHandler('focus.typezone')
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 73
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.notCalled, 'because typezone is not focused'
                typeZoneView.focus()
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.called

        describe 'keypress', ->
            it 'should trigger `entry:typed` event', ->
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 73
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.calledWith('entry:typed', 'I')

             it 'should handle unicode characters', ->
                gameController.setEntries '💩'
                e = jQuery.Event 'keypress'
                e.originalEvent = true
                e.which = 0x1F4A9
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.calledWith('entry:is_correct', 0)

        describe 'keydown', ->
            it 'should trigger `entry:delete` event on backspace keydown', ->
                e = jQuery.Event 'keydown'
                e.originalEvent = true
                e.which = 8
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.calledWith('entry:deleted')

            it 'should trigger `human:reset` event on escape keydown', ->
                e = jQuery.Event 'keydown'
                e.originalEvent = true
                e.which = 27
                typeZoneView.ui.input.trigger e
                assert.isTrue gameController.trigger.calledWith('human:reset')

        describe 'entry:is_correct', ->
            it 'should add `correct` class to element', ->
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('correct')
                gameController.trigger 'entry:is_correct', 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')

        describe 'entry:is_incorrect', ->
            it 'should add `incorrect` class to element', ->
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('incorrect')
                gameController.trigger 'entry:is_incorrect', 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('incorrect')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')

        describe 'entry:is_reset', ->
            it 'should remove all classes from current element', ->
                gameController.trigger 'entry:is_correct', 0
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isTrue typeZoneView.ui.entries.eq(1).hasClass('current')
                gameController.trigger 'entry:is_reset', 0
                assert.isFalse typeZoneView.ui.entries.eq(0).hasClass('correct')
                assert.isFalse typeZoneView.ui.entries.eq(1).hasClass('current')
                assert.isTrue typeZoneView.ui.entries.eq(0).hasClass('current')

        describe 'human:stop', ->
            # it 'should should disable input', ->
            #     assert.isFalse typeZoneView.ui.input.prop('disabled')
            #     gameController.trigger 'human:stop'
            #     assert.isTrue typeZoneView.ui.input.prop('disabled')

            it 'should blur the type zone', ->
                sinon.spy(typeZoneView, 'blur')
                $(window).triggerHandler('blur.typezone')
                assert.isTrue typeZoneView.blur.called
                typeZoneView.blur.restore()

        afterEach () ->
            gameController.trigger.restore()
            gameController.stop()
            typeZoneView.reset()

        after () ->
            gameController.close()
            typeZoneView.close()
