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
            timer: 60
        )

    Make game listening for keyboard events
        gameController.listen();

    Optionally start the game manually
        gameController.start();

    Game will automatically stop when timer is over or everything has been typed
    Or you can stop it manually :
        gameController.stop();

    Optionally change game settings
        gameController.setTimer(30);
        gameController.setEntries('hello sick world');

    Start over
        gameController.listen();

###

#global define
define ["jquery", "underscore", "marionette", "backbone", "models/player", "models/ghost", "controllers/timer"], ($, _, Marionette, Backbone, PlayerModel, GhostModel, TimerController) ->
    "use strict"

    ENTRY_CORRECT = 1
    ENTRY_INCORRECT = -1
    ENTRY_TO_BE_FIXED = 0
    ENTRY_DELETED = 2

    class GameController extends Marionette.Controller

        # Defaults
        entries: '' # String
        timer: 60 # Seconds

        reset: ->
            @timerController.reset()

        initialize: (options) ->
            @timer = options.timer
            @entries = options.entries

            @player = new PlayerModel({ entries : options.entries })
            @ghostCollection = new Backbone.Collection()
            window.ghostCollection = @ghostCollection

            @timerController = new TimerController()

            $(window).focus () =>
                console.log 'focus : bind listen events'
                @bindEvents();
            $(window).blur () =>
                console.log 'blur : unbind listen events'
                @off();

        bindEvents: ->
            @.on 'entry:typed', (entry) =>
                @player.typeEntry(entry, @timerController.getElapsedTime())

            @.on 'entry:deleted', =>
                @player.deleteEntry(@timerController.getElapsedTime())

            @player.on 'game:finished', =>
                @stop()

        listen: ->
            unless @listening
                @listening = true

                if @timer
                    console.log 'You have ' + @timer + ' seconds to type :' + @entries

                @bindEvents()

        start: ->
            unless @running
                console.log 'Game started'
                @running = true

                @timerController.start()

                @ghostCollection.invoke 'run'

                timer = @timer - 1 if @timer
                @interval = setInterval(=>
                    if @timer
                        if timer > 0
                            timer--
                        else
                            @stop()

                    # Publish stats every seconds
                    @trigger 'game:stats', @player.getStats(@timerController.getElapsedTime())
                , 1000)

        stop: ->
            if @running
                console.log 'Game stopped'
                @timerController.stop()

                clearInterval(@interval)
                @off()

                @running = false
                @listening = false

                if @player.isCheating()
                    console.log 'You are a cheater'
                else
                    console.log 'You are not a cheater'

                console.log JSON.stringify @player.getStats(@timerController.getElapsedTime())
                console.log JSON.stringify @player.getRecords()

        # Setters
        # Milliseconds

        # TODO : Check parameter type
        setEntries: (entries) ->
            unless @running
                @entries = entries if entries
                console.log 'You have ' + @timer + ' seconds to type :' + @entries

        setTimer: (timer) ->
            unless @running
                @timer = timer if timer
                console.log 'You have ' + @timer + ' seconds to type :' + @entries

        addGhost: (entriesLogs) ->
            @ghostCollection.add new GhostModel({ entries: @entries, entriesLogs: entriesLogs })
