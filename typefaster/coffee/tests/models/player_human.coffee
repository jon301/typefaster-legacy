#global define
define [
    'jquery',
    'backbone',
    'chai',
    'controllers/game'
    ], ($, Backbone, chai, GameController) ->
    'use strict'

    expect = chai.expect
    assert = chai.assert

    gameController = undefined

    describe 'PlayerHumanModel', ->

        before () ->
            gameController = new GameController(
                entries: 'Iñtërnâtiônàlizætiøn☃💩'
                duration: null
            )

        beforeEach () ->

        describe 'TODO', ->
            it 'TODO', ->
                assert.isTrue true

        afterEach () ->

        after () ->
            gameController.close()
