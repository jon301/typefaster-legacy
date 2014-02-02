###
    Speed : Raw speed with mistake penalties
        Speed = Raw speed - Error Rate

    Accuracy : The percentage of correct entries out of the total entries typed
        Accuracy = (Correct Entries / Total Entries) x 100

    Correct Entries : All keys typed correctly (even correct entries deleted then re-entered correctly again)

    Incorrect Entries : All keys typed incorrectly (even if deleted and corrected later)

    Fixed Mistakes : All incorrect entries that were fixed later (number of mistakes deleted and entered correctly)

    Total Entries : All keys typed (excluding function keys)
        Total Entries = Correct Entries + Incorrect Entries

    Error Rate : Number of incorrect Entries (unfixed mistakes) per minute
        Error Rate = (Incorrect Entries - Fixed Mistakes) / Time in Minutes

    Raw Speed : Typing Speed before mistake penalties
        Raw Speed = ( Total Entries / Time in minutes ) / 5
        (where 5 = average length of a word)

    Key Speed : Number of keystrokes per minute
        Key Speed = Total Entries / Time in minutes

    Complete Words : Number of complete words typed ('the' and 'messenger' are both one word)

    Total Time : Total time of round in minutes
        Time in minutes = Time in seconds / 60
###

#global define
define [
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'js_logger'
    'app',
    'controllers/timer',
    'models/player_human',
    'models/player_ghost',
    'views/item/typezone'
    ], ($, _, Backbone, Marionette, Logger, app, TimerController, PlayerHumanModel, PlayerGhostModel, TypeZoneView) ->
    'use strict'

    # Module definition
    class GameController extends Marionette.Controller

        # Defaults
        entries: '' # String
        duration: 60 # Seconds

        ghostColors: ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy',
            'olive', 'silver', 'teal', 'yellow', 'orange', 'purple', 'red']

        initialize: (options) ->
            @logger = Logger.get 'GameController'

            @duration = options.duration
            @entries = options.entries

            # Empty players collection
            @players = new Backbone.Collection()

            # Timer
            @timer = new TimerController()

            @initEventAggregator()

        initEventAggregator: () ->
            @listenTo @players, 'add', (playerModel) ->
                app.vent.trigger 'player:add', playerModel

            @listenTo @players, 'remove', (playerModel) ->
                app.vent.trigger 'player:remove', playerModel

            @listenTo app.vent, 'human:start', () =>
                @start() unless @running

            @listenTo app.vent, 'human:stop', () =>
                @stop()

            @listenTo app.vent, 'keyboard:escape', =>
                @stop()

        start: ->
            unless @running
                @logger.debug 'Game started'
                @running = true

                @players.invoke 'play'

                if @duration
                    @timer.start()

                    @interval = setInterval(=>
                        if @timer.getElapsedTime() >= @duration * 1000
                            @stop()

                        # Publish stats every seconds
                        if typeof @humanPlayer isnt 'undefined'
                            app.vent.trigger 'human:stats', @humanPlayer.getStats()
                    , 1000)

        stop: ->
            if @running
                @logger.debug 'Game stopped'
                @running = false

                clearInterval(@interval)

                @timer.stop()
                @players.invoke 'stop'

        # Setters
        setEntries: (entries) ->
            if not @running and entries
                @entries = entries
                @players.invoke 'setEntries', @entries

        setDuration: (duration) ->
            unless @running
                @duration = duration if duration


        addHuman: () ->
            unless @running and @humanPlayer
                @humanPlayer = new PlayerHumanModel({ entries: @entries })
                @players.add @humanPlayer

        removeHuman: () ->

        addGhost: (replayLogs) ->
            unless @running
                @players.add new PlayerGhostModel({ entries: @entries, replayLogs: replayLogs, color: @ghostColors.pop() })

        removeGhost: (cid) ->
