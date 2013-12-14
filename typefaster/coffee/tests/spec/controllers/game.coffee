#global define
define [
    'jquery',
    'backbone',
    'controllers/game'
    ], ($, Backbone, GameController) ->
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

            # it 'should stop event listening', () ->
            #     gameController.startListen()
            #     gameController.trigger('keyboard:char', 'a')
            #     gameController.stop()
            #     gameController.trigger('keyboard:char', 'a')
            #     assert.isTrue typeEntrySpy.calledOnce

        describe 'on event', ->
            # beforeEach () ->
            #     gameController.startListen()

            describe 'keyboard:char', ->
                it 'should call `typeEntry` with the char pressed', () ->
                    gameController.trigger('keyboard:char', 'a')
                    assert.isTrue typeEntrySpy.calledWith('a')

                it 'should start the game on the first char pressed only', () ->
                    gameController.trigger('keyboard:char', 'a')
                    gameController.trigger('keyboard:char', 'a')
                    assert.isTrue playSpy.calledOnce

            describe 'keyboard:backspace', ->
                it 'should call `deleteEntry` everytime', () ->
                    gameController.trigger('keyboard:backspace')
                    gameController.trigger('keyboard:backspace')
                    assert.isTrue deleteEntrySpy.calledTwice

            describe 'human:stop', ->
                it 'should stop the game', () ->
                    gameController.start()
                    gameController.trigger('human:stop')
                    assert.isTrue stopSpy.called

        # describe 'stopListen', ->
        #     beforeEach () ->
        #         gameController.startListen()

        #     it 'should prevent all callbacks to be triggered', () ->
        #         gameController.stopListen()
        #         gameController.trigger('keyboard:char', 'a')
        #         gameController.trigger('keyboard:backspace')
        #         gameController.trigger('human:stop')
        #         assert.isTrue typeEntrySpy.notCalled
        #         assert.isTrue deleteEntrySpy.notCalled
        #         assert.isTrue stopSpy.notCalled

        afterEach () ->
            gameController.stop()
            timer.restore()
            playSpy.restore()
            stopSpy.restore()
            typeEntrySpy.restore()
            deleteEntrySpy.restore()

        after () ->
            gameController.close()
