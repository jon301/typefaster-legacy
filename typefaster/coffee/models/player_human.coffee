#global define
define ["jquery", "underscore", "models/player"], ($, _, PlayerModel) ->
    "use strict"

    class PlayerHumanModel extends PlayerModel

        replayLogs: [] # For ghost

        stop: () ->
            super()
            console.log JSON.stringify @replayLogs
            @.trigger 'human:stop'

        typeEntry: (entry) ->
            super entry
            @replayLogs.push { t: @timer.getElapsedTime(), v: entry }

        deleteEntry: () ->
            if super()
                @replayLogs.push { t: @timer.getElapsedTime(), v: -1 }

        getReplayLogs: ->
            @replayLogs
