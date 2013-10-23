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
define ["jquery", "underscore", "marionette"], ($, _, Marionette) ->
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
            @correctEntries = 0
            @incorrectEntries = 0
            @fixedMistakes = 0
            @currentIndex = 0
            @startTime = null
            @stopTime = null
            @entriesMapStatus = [] # For computing stats
            @entriesLogs = {} # For ghost

        initialize: (options) ->
            @timer = options.timer
            @entries = options.entries

            $(window).focus () =>
                console.log 'focus : bind listen events'
                @bindEvents();
            $(window).blur () =>
                console.log 'blur : unbind listen events'
                @stopListening();

        bindEvents: ->
            @listenTo @, 'entry:typed', (entry) =>
                @start()
                if entry is @entries[@currentIndex]
                    console.log 'entry:is_correct', entry, @entries[@currentIndex]
                    @correctEntries++
                    @fixedMistakes++ if @entriesMapStatus[@currentIndex] is ENTRY_TO_BE_FIXED
                    @entriesMapStatus[@currentIndex] = ENTRY_CORRECT
                    @pushEntryLog ENTRY_CORRECT
                    @trigger 'entry:is_correct', @currentIndex
                    @currentIndex++
                    @stop() if @entries.length is @currentIndex
                else
                    console.log 'entry:is_incorrect', entry, @entries[@currentIndex]
                    @incorrectEntries++
                    @entriesMapStatus[@currentIndex] = ENTRY_INCORRECT
                    @pushEntryLog ENTRY_INCORRECT
                    @trigger 'entry:is_incorrect', @currentIndex
                    @currentIndex++

            @listenTo @, 'entry:deleted', () =>
                if @currentIndex > 0
                    @currentIndex--
                    console.log 'entry:is_reset', @entries[@currentIndex]
                    if @entriesMapStatus[@currentIndex] is ENTRY_INCORRECT
                        @entriesMapStatus[@currentIndex] = ENTRY_TO_BE_FIXED
                    else
                        @entriesMapStatus[@currentIndex] = ENTRY_DELETED
                    @pushEntryLog ENTRY_DELETED
                    @trigger 'entry:is_reset', @currentIndex

        listen: ->
            unless @listening
                @reset()
                @listening = true

                console.log 'You have ' + @timer + ' seconds to type :' + @entries
                @bindEvents()

        start: ->
            if not @running and @listening
                console.log 'Game started'
                @running = true
                @startTime = new Date().getTime()
                timer = @timer
                timer--;
                @interval = setInterval(=>
                    if timer > 0
                        timer--
                    else @stop()
                    # Publish stats every seconds
                    @trigger 'game:stats', @stats()
                , 1000)

        stop: ->
            if @running
                console.log 'Game stopped'
                @stopTime = new Date().getTime()
                clearInterval(@interval)
                @stopListening()
                @running = false
                @listening = false

                if @cheating()
                    console.log 'You are a cheater'
                else
                    console.log 'You are not a cheater'

                console.log JSON.stringify @stats()
                console.log JSON.stringify @entriesLogs

        stats: ->
            if @stopTime
                currentTime = @stopTime
            else
                currentTime = (new Date).getTime()

            elapsedTime = if @startTime then (currentTime - @startTime) / 1000 else 0 # Seconds
            elapsedTimeMinutes =  (Math.ceil elapsedTime) / 60
            totalEntries = @correctEntries + @incorrectEntries
            errorRate = (@incorrectEntries - @fixedMistakes) / elapsedTimeMinutes
            rawSpeed = (totalEntries / elapsedTimeMinutes) / 5

            elapsedTime: elapsedTime
            correctEntries: @correctEntries
            incorrectEntries: @incorrectEntries
            fixedMistakes: @fixedMistakes
            totalEntries: totalEntries
            errorRate: errorRate
            rawSpeed: rawSpeed
            keySpeed: totalEntries / elapsedTimeMinutes
            speed: rawSpeed - errorRate
            accuracy: (if totalEntries then (@correctEntries / totalEntries) * 100 else 0)

        cheating: ->
            logs = _.keys @entriesLogs
            logs = $.map logs, (val, i) ->
                return null  if i is 0
                val - logs[i - 1]
            console.log logs
            logs = _.uniq(logs)

            if logs.length

                # Check if intervals between each keystrokes are the same
                totalKeystrokes = @correctEntries + @incorrectEntries
                equalPercent = 100 - (parseInt logs.length / totalKeystrokes * 100, 10)

                # Check if the average interval between all keystrokes is not too insane
                sumIntervals = _.reduce logs, (memo, num) ->
                    return memo + num
                averageInterval  = parseInt sumIntervals / logs.length, 10

                console.log 'Intervals equal percentage: ' + equalPercent
                console.log 'Average interval : ' + averageInterval + 'ms'

            else
                equalPercent = 0
                averageInterval = NaN

            equalPercent > 70 or averageInterval < 30

        # Setters
        # TODO : Check parameter type
        setEntries: (entries) ->
            unless @running
                @entries = entries if entries
                console.log 'You have ' + @timer + ' seconds to type :' + @entries

        setTimer: (timer) ->
            unless @running
                @timer = timer if timer
                console.log 'You have ' + @timer + ' seconds to type :' + @entries

        pushEntryLog: (entryStatus) ->
            if @running and @listening
                i = new Date().getTime() - @startTime
                @entriesLogs[i] = entryStatus
