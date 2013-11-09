#global define
define ["jquery", "underscore", "marionette"], ($, _, Marionette) ->
    "use strict"

    class TimerController extends Marionette.Controller

        startTime: 0
        stopTime: 0
        elapsedTime: 0

        interval: null

        initialize: () ->
            @performance = window.performance || {};

            @performance.now =
                performance.now ||
                performance.webkitNow ||
                performance.msNow ||
                performance.oNow ||
                performance.mozNow

        now: () ->
            if @performance.now
                @performance.now()
            else
                new Date().getTime()

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
