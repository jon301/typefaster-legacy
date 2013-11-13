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
    'models/player_ghost'
    ], ($, _, Backbone, Marionette, Logger, TimerController, PlayerHumanModel, PlayerGhostModel) ->
    'use strict'

    class GameController extends Marionette.Controller

        # Defaults
        entries: '' # String
        duration: 60 # Seconds

        initialize: (options) ->
            @logger = Logger.get 'GameController'
            @duration = options.duration
            @entries = options.entries

            @humanPlayer = new PlayerHumanModel({ gameController: @ })
            @ghostPlayers = new Backbone.Collection()

            @timer = new TimerController()

        startListen: ->
            unless @listening
                @logger.debug 'game: bind listen events'
                @listening = true

                @.listenTo @, 'entry:typed', (entry) =>
                    @start() unless @running
                    @humanPlayer.typeEntry(entry)

                @.listenTo @, 'entry:deleted', =>
                    @humanPlayer.deleteEntry()

                @.listenTo @, 'human:stop', =>
                    @stop()

                @.listenTo @, 'human:reset', =>
                    @stop()
                    @startListen()

        stopListen: ->
            @logger.debug 'game: unbind listen events'
            @listening = false
            @stopListening();

        start: ->
            unless @running
                @logger.debug 'Game started'
                @running = true

                @humanPlayer.play()
                @ghostPlayers.invoke 'play'

                if @duration
                    @timer.start()

                    @interval = setInterval(=>
                        if @timer.getElapsedTime() >= @duration * 1000
                            @stop()
                        # Publish stats every seconds
                        @trigger 'human:stats', @humanPlayer.getStats()
                    , 1000)

        stop: ->
            if @running
                @logger.debug 'Game stopped'
                @running = false

                clearInterval(@interval)
                @stopListen()

                @timer.stop()
                @humanPlayer.stop()

        # Setters
        setEntries: (entries) ->
            unless @running
                @entries = entries if entries
                @logger.debug 'You have ' + @duration + ' seconds to type :' + @entries

        setDuration: (duration) ->
            unless @running
                @duration = duration if duration
                @logger.debug 'You have ' + @duration + ' seconds to type :' + @entries

        addGhost: (replayLogs) ->
            unless @running
                @ghostPlayers.add new PlayerGhostModel({ entries: @entries, replayLogs: replayLogs, gameController: @ })
