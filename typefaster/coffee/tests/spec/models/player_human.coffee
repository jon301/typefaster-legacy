#global define
define [
    'jquery',
    'backbone',
    'app',
    'controllers/game'
    ], ($, Backbone, app, GameController) ->
    'use strict'

    gameController = undefined
    humanPlayer = undefined

    describe 'PlayerHumanModel', ->

        before () ->
            gameController = new GameController(
                entries: 'Iñtërnâtiônàlizætiøn☃💩'
                duration: null
            )
            gameController.addHuman()
            humanPlayer = gameController.humanPlayer

        beforeEach () ->
            app.vent.trigger = sinon.spy(app.vent, 'trigger')
            humanPlayer.play()

        describe 'typeEntry', ->
            it 'should increment current index', ->
                humanPlayer.typeEntry 'a'
                assert.isTrue humanPlayer.currentIndex == 1

             it 'should handle correct entries', ->
                humanPlayer.typeEntry 'I'
                assert.isTrue humanPlayer.correctEntries == 1
                assert.isTrue app.vent.trigger.calledWith 'entry:is_correct', humanPlayer, 0

             it 'should handle incorrect entries', ->
                humanPlayer.typeEntry 'a'
                assert.isTrue humanPlayer.incorrectEntries == 1
                assert.isTrue app.vent.trigger.calledWith 'entry:is_incorrect', humanPlayer, 0

             it 'should handle fixed mistakes', ->
                humanPlayer.typeEntry 'a'
                assert.isTrue humanPlayer.incorrectEntries == 1
                assert.isTrue humanPlayer.fixedMistakes == 0
                assert.isTrue humanPlayer.correctEntries == 0
                assert.isTrue app.vent.trigger.calledWith 'entry:is_incorrect', humanPlayer, 0
                humanPlayer.deleteEntry()
                humanPlayer.typeEntry 'I'
                assert.isTrue humanPlayer.incorrectEntries == 1
                assert.isTrue humanPlayer.fixedMistakes == 1
                assert.isTrue humanPlayer.correctEntries == 1
                assert.isTrue app.vent.trigger.calledWith 'entry:is_correct', humanPlayer, 0

            it 'should stop the game if all entries have been typed', ->
                i = 0
                while i < 22
                    humanPlayer.typeEntry 'a'
                    i++
                assert.isTrue app.vent.trigger.calledWith 'human:stop'

            it 'should handle unicode characters', ->
                humanPlayer.typeEntry 'I'
                humanPlayer.typeEntry 'ñ'
                humanPlayer.typeEntry 't'
                humanPlayer.typeEntry 'ë'
                humanPlayer.typeEntry 'r'
                humanPlayer.typeEntry 'n'
                humanPlayer.typeEntry 'â'
                humanPlayer.typeEntry 't'
                humanPlayer.typeEntry 'i'
                humanPlayer.typeEntry 'ô'
                humanPlayer.typeEntry 'n'
                humanPlayer.typeEntry 'à'
                humanPlayer.typeEntry 'l'
                humanPlayer.typeEntry 'i'
                humanPlayer.typeEntry 'z'
                humanPlayer.typeEntry 'æ'
                humanPlayer.typeEntry 't'
                humanPlayer.typeEntry 'i'
                humanPlayer.typeEntry 'ø'
                humanPlayer.typeEntry 'n'
                humanPlayer.typeEntry '☃'
                humanPlayer.typeEntry '💩'
                assert.isTrue humanPlayer.correctEntries == 22

        describe 'deleteEntry', ->
            it 'should decrement current index', ->
                humanPlayer.typeEntry 'a'
                assert.isTrue humanPlayer.currentIndex == 1
                humanPlayer.deleteEntry()
                assert.isTrue app.vent.trigger.calledWith 'entry:is_reset', humanPlayer, 0
                assert.isTrue humanPlayer.currentIndex == 0

            it 'should not decrement current index if current index is 0', ->
                humanPlayer.deleteEntry()
                humanPlayer.deleteEntry()
                assert.isTrue app.vent.trigger.notCalled


        afterEach () ->
            app.vent.trigger.restore()
            humanPlayer.stop()

        after () ->
            gameController.close()
