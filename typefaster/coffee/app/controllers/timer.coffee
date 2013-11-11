#global define
define ['jquery', 'underscore', 'marionette'], ($, _, Marionette) ->
    'use strict'

    class TimerController extends Marionette.Controller

        startTime: 0
        stopTime: 0
        elapsedTime: 0

        interval: null

        initialize: () ->
            if typeof window.performance != 'undefined'
                @performance = window.performance
                @performance.now =
                    performance.now ||
                    performance.webkitNow ||
                    performance.msNow ||
                    performance.oNow ||
                    performance.mozNow
            else
                @performance = {}
                @performance.now = Date.now

        now: () ->
            @performance.now()

        reset: ->
            @startTime = 0
            @stopTime = 0
            @elapsedTime = 0

        start: ->
            @reset()
            @startTime = @now()

        stop: ->
            if @stopTime is 0
                @stopTime = @now()
                @elapsedTime = @stopTime - @startTime

        # Milliseconds
        getElapsedTime: ->
            if @stopTime is 0
                @elapsedTime = @now() - @startTime
            Math.round @elapsedTime
