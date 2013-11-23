#global define
define [
    'jquery',
    'underscore',
    'js_logger',
    'models/player',
    'controllers/timer'
    ], ($, _, Logger, PlayerModel, TimerController) ->
    'use strict'

    class PlayerGhostModel extends PlayerModel

        initialize: (options) ->
            super options
            @logger = Logger.get 'PlayerGhostModel'
            @replayLogs = options.replayLogs
            @color = options.color

        play: () ->
            super()
            @replay()

        stop: () ->
            super()
            clearTimeout @timeout

        replay: () ->
            unless @entryLog
                @entryLog = @replayLogs.shift()

            if @timer.getElapsedTime() >= @entryLog.t
                if @entryLog.v == -1
                    @deleteEntry()
                else
                    @typeEntry @entryLog.v
                @entryLog = @replayLogs.shift()

            if @entryLog
                @timeout = setTimeout($.proxy(@replay, @), 1)

        getType: () ->
            'ghost'

        getColor: () ->
            @color
