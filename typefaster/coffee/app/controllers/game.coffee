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
    'controllers/timer',
    'models/player_human',
    'models/player_ghost',
    'views/item/typezone'
    ], ($, _, Backbone, Marionette, Logger, TimerController, PlayerHumanModel, PlayerGhostModel, TypeZoneView) ->
    'use strict'

    class GameController extends Marionette.Controller

        # Defaults
        entries: '' # String
        duration: 60 # Seconds

        ghostColors: ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'silver', 'teal', 'yellow', 'orange', 'purple', 'red']

        initialize: (options) ->
            @logger = Logger.get 'GameController'
            @duration = options.duration
            @entries = options.entries

            @players = new Backbone.Collection()

            @timer = new TimerController()

            @typeZoneView = new TypeZoneView({ gameController: @ })
            @typeZoneView.render()

        startListen: ->
            unless @listening
                @logger.debug 'game: bind listen events'
                @listening = true

                @.listenTo @, 'human:stop', () =>
                    @stop()

                @.listenTo @players, 'add', (playerModel) =>
                    @.trigger 'player:add', playerModel

                @.listenTo @players, 'remove', (playerModel) =>
                    @.trigger 'player:remove', playerModel

        stopListen: ->
            @logger.debug 'game: unbind listen events'
            @listening = false
            @stopListening();

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
                            @trigger 'human:stats', @humanPlayer.getStats()
                    , 1000)

        stop: ->
            if @running
                @logger.debug 'Game stopped'
                @running = false

                clearInterval(@interval)
                @stopListen()

                @timer.stop()
                @players.invoke 'stop'

        # Setters
        setEntries: (entries) ->
            unless @running
                @entries = entries if entries

        setDuration: (duration) ->
            unless @running
                @duration = duration if duration


        addHuman: () ->
            unless @running and @humanPlayer
                @humanPlayer = new PlayerHumanModel({ gameController: @ })
                @players.add @humanPlayer

        removeHuman: () ->

        addGhost: (replayLogs) ->
            unless @running
                @players.add new PlayerGhostModel({ gameController: @, replayLogs: replayLogs, color: @ghostColors.pop() })

        removeGhost: (cid) ->
