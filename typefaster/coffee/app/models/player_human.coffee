#global define
define [
    'jquery',
    'underscore',
    'js_logger',
    'app',
    'models/player'
    ], ($, _, Logger, app, PlayerModel) ->
    'use strict'

    # Module definition
    class PlayerHumanModel extends PlayerModel

        replayLogs: [] # For ghost

        initialize: (options) ->
            super options
            @logger = Logger.get 'PlayerHumanModel'

            @initEventAggregator()

        initEventAggregator: ->
            @listenTo app.vent, 'keyboard:char', (entry) =>
                app.vent.trigger 'human:start'
                @typeEntry(entry)

            @listenTo app.vent, 'keyboard:backspace', =>
                @deleteEntry()

        stop: () ->
            super()
            @logger.debug JSON.stringify @replayLogs
            app.vent.trigger 'human:stop'

        reset: () ->
            super()
            @replayLogs = []

        typeEntry: (entry) ->
            @replayLogs.push { t: @timer.getElapsedTime(), v: entry }
            super entry

        deleteEntry: () ->
            if super()
                @replayLogs.push { t: @timer.getElapsedTime(), v: -1 }

        getReplayLogs: ->
            @replayLogs

        getType: ->
            'human'
