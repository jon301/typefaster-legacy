#global define
define [
    'jquery',
    'backbone',
    'app',
    'controllers/game'
    ], ($, Backbone, app, GameController) ->
    'use strict'

    gameController = undefined
    timer = undefined
    playSpy = undefined
    stopSpy = undefined
    typeEntrySpy = undefined
    deleteEntrySpy = undefined

    describe 'GameController', ->
        before () ->
            gameController = new GameController(
                entries: 'Hello World'
                duration: null
            )
            gameController.addHuman()

        beforeEach () ->
            timer = sinon.useFakeTimers()
            playSpy = sinon.spy(gameController.humanPlayer, 'play')
            stopSpy = sinon.spy(gameController.humanPlayer, 'stop')
            typeEntrySpy = sinon.spy(gameController.humanPlayer, 'typeEntry')
            deleteEntrySpy = sinon.spy(gameController.humanPlayer, 'deleteEntry')

        afterEach () ->
            gameController.stop()
            timer.restore()
            playSpy.restore()
            stopSpy.restore()
            typeEntrySpy.restore()
            deleteEntrySpy.restore()

        after () ->
            gameController.close()

        describe 'start', ->
            it 'can be called only once', () ->
                gameController.start()
                gameController.start()
                assert.isTrue playSpy.calledOnce

        describe 'stop', ->
            it 'can be called only if started', () ->
                gameController.stop()
                assert.isTrue stopSpy.notCalled

            it 'can be called only once', () ->
                gameController.start()
                gameController.stop()
                gameController.stop()
                assert.isTrue stopSpy.calledOnce

            it 'should be called after `duration` second(s) : 1 second', () ->
                duration = .0001
                gameController.setDuration(duration)
                gameController.start()
                timer.tick(999)
                assert.isTrue stopSpy.notCalled, 'not called at 999ms'
                timer.tick(1000)
                assert.isTrue stopSpy.called, 'called at 1000ms'

        describe 'on app.vent', ->

            describe 'keyboard:char', ->
                it 'should call `typeEntry` with the char pressed', () ->
                    app.vent.trigger('keyboard:char', 'a')
                    assert.isTrue typeEntrySpy.calledWith('a')

                it 'should start the game on the first char pressed only', () ->
                    app.vent.trigger('keyboard:char', 'a')
                    app.vent.trigger('keyboard:char', 'a')
                    assert.isTrue playSpy.calledOnce

            describe 'keyboard:backspace', ->
                it 'should call `deleteEntry` everytime', () ->
                    app.vent.trigger('keyboard:backspace')
                    app.vent.trigger('keyboard:backspace')
                    assert.isTrue deleteEntrySpy.calledTwice

            describe 'human:stop', ->
                it 'should stop the game', () ->
                    gameController.start()
                    app.vent.trigger('human:stop')
                    assert.isTrue stopSpy.called
