#global define
define ['jquery', 'backbone'], ($, Backbone) ->
    'use strict'

    describe 'random', ->
        it '1 should not equal 2', () ->
            1.should.not.equal 2
            timer = sinon.useFakeTimers()
