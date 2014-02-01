#global define
define (require) ->
    'use strict';

    # Module dependencies
    $ = require('jquery');
    _ = require('underscore');
    Logger = require('js_logger');
    PlayerModel = require('models/player');

    # Module definition
    class PlayerHumanModel extends PlayerModel

        replayLogs: [] # For ghost

        initialize: (options) ->
            super options
            @logger = Logger.get 'PlayerHumanModel'

            @.listenTo @gameController, 'keyboard:char', (entry) =>
                @gameController.start() unless @gameController.running
                @.typeEntry(entry)

            @.listenTo @gameController, 'keyboard:backspace', =>
                @.deleteEntry()

        stop: () ->
            super()
            @logger.debug JSON.stringify @replayLogs
            @gameController.trigger 'human:stop'

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
