#global define
define ["jquery", "underscore", "models/player", "controllers/timer"], ($, _, PlayerModel, TimerController) ->
    "use strict"

    class PlayerGhostModel extends PlayerModel

        initialize: (options) ->
            super options
            @replayLogs = options.replayLogs

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
