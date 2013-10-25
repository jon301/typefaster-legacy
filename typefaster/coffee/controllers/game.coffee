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

    http://jsfiddle.net/v7GN3/
    $(window).resize(function() { $('#type-inner').scrollTop($('#type-inner').scrollTop() + $('#titi').position().top); });


###

###
    To begin a new game :
        gameController = new GameController(
            entries: "hello world"
            duration: 60
        )

    Make game listening for keyboard events
        gameController.listen();

    Optionally start the game manually
        gameController.start();

    Game will automatically stop when time is over or everything has been typed
    Or you can stop it manually :
        gameController.stop();

    Optionally change game settings
        gameController.setTimer(30);
        gameController.setEntries('hello sick world');

    Start over
        gameController.listen();

###

#global define
define ["jquery", "underscore", "marionette", "backbone", "controllers/timer", "models/player_human", "models/player_ghost"], ($, _, Marionette, Backbone, TimerController, PlayerHumanModel, PlayerGhostModel) ->
    "use strict"

    class GameController extends Marionette.Controller

        # Defaults
        entries: '' # String
        duration: 60 # Seconds

        initialize: (options) ->
            @duration = options.duration
            @entries = options.entries

            @humanPlayer = new PlayerHumanModel({ entries : options.entries })
            @ghostPlayers = new Backbone.Collection()

            @timer = new TimerController()

            $(window).focus () =>
                console.log 'focus : bind listen events'
                @startListening();
            $(window).blur () =>
                console.log 'blur : unbind listen events'
                @stopListening();

        startListening: ->
            unless @listening
                @listening = true

                @.listenTo @, 'entry:typed', (entry) =>
                    @humanPlayer.typeEntry(entry)

                @.listenTo @, 'entry:deleted', =>
                    @humanPlayer.deleteEntry()

                @.listenTo @humanPlayer, 'human:stop', =>
                    @stop()

                if @duration
                    console.log 'You have ' + @duration + ' seconds to type :' + @entries
                else
                    console.log 'You have unlimited time to type : ' + @ entries

        start: ->
            unless @running
                console.log 'Game started'
                @running = true

                @humanPlayer.play()
                @ghostPlayers.invoke 'play'

                if @duration
                    @timer.start()

                    @interval = setInterval(=>
                        if @timer.getElapsedTime() >= @duration * 1000
                            @timer.stop()
                            @stop()
                        # Publish stats every seconds
                        @trigger 'human:stats', @humanPlayer.getStats()
                    , 1000)

        stop: ->
            if @running
                console.log 'Game stopped'

                clearInterval(@interval)
                @stopListening()

                @running = false
                @listening = false

        # Setters
        setEntries: (entries) ->
            unless @running
                @entries = entries if entries
                console.log 'You have ' + @duration + ' seconds to type :' + @entries

        setDuration: (duration) ->
            unless @running
                @duration = duration if duration
                console.log 'You have ' + @duration + ' seconds to type :' + @entries

        addGhost: (replayLogs) ->
            unless @running
                @ghostPlayers.add new PlayerGhostModel({ entries: @entries, replayLogs: replayLogs })
