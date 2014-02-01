#global define
define (require) ->
    'use strict';

    # Module dependencies
    $ = require('jquery');
    _ = require('underscore');
    Logger = require('js_logger');
    PlayerModel = require('models/player');
    TimerController = require('controllers/timer');

    # Module definition
    class PlayerGhostModel extends PlayerModel

        initialize: (options) ->
            super options
            @logger = Logger.get 'PlayerGhostModel'
            @color = options.color
            @replayLogs = options.replayLogs

        play: () ->
            super()
            @replayLogsTmp = @replayLogs.slice(0)
            @entryLog = null
            @replay()

        stop: () ->
            super()
            clearTimeout @timeout

        replay: () ->
            unless @entryLog
                @entryLog = @replayLogsTmp.shift()

            if @timer.getElapsedTime() >= @entryLog.t
                if @entryLog.v == -1
                    @deleteEntry()
                else
                    @typeEntry @entryLog.v
                @entryLog = @replayLogsTmp.shift()

            if @entryLog
                @timeout = setTimeout($.proxy(@replay, @), 1)

        getType: () ->
            'ghost'

        getColor: () ->
            @color
