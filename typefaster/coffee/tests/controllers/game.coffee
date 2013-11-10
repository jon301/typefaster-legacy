define ['jquery', 'backbone', 'chai', 'controllers/game'], ($, Backbone, chai, GameController) ->
    'use strict'

    expect = chai.expect
    assert = chai.assert

    gameController = null
    describe 'GameController', ->
        before () ->

        beforeEach () ->
            gameController = new GameController(
                entries: 'Iñtërnâtiônàlizætiøn☃💩'
                duration: null
            )

        describe 'initialize', ->
            # TODO

        describe 'start', ->
            it 'can be called only once', () ->
                play = sinon.spy()
                gameController.humanPlayer.play = play
                gameController.start()
                gameController.start()
                assert.isTrue play.calledOnce

        describe 'stop', ->
            it 'can be called only once', () ->
                gameController.start()
                stop = sinon.spy()
                gameController.humanPlayer.stop = stop
                gameController.stop()
                gameController.stop()
                assert.isTrue stop.calledOnce

            it 'can be called only if started', () ->
                stop = sinon.spy()
                gameController.humanPlayer.stop = stop
                gameController.stop()
                assert.isTrue stop.notCalled

            it 'should be called after 1s', (done) ->
                duration = 1
                gameController.setDuration(duration)
                stop = sinon.spy()
                gameController.humanPlayer.stop = stop
                gameController.start()
                assert.isTrue stop.notCalled
                setTimeout () ->
                    assert.isTrue stop.called
                    done()
                , 1000

        afterEach () ->
            gameController.stop()
            gameController.close()
