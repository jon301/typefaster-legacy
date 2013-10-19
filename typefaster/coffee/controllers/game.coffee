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
#global define
define ["jquery", "underscore", "marionette"], ($, _, Marionette) ->
    "use strict"

    ENTRY_CORRECT = 1
    ENTRY_INCORRECT = -1
    ENTRY_TO_BE_FIXED = 0

    class GameController extends Marionette.Controller

        # Configuration
        entries: '' # String
        timer: 60 # Seconds

        # Internal variables
        entriesMapStatus: []
        logs: []

        initialize: (options) ->
            @reset()
            @timer(options.timer)
            @entries(options.entries)

            console.log 'You have ' + @timer + ' to type :' + @entries
            @listen()

        listen: ->
            @listenTo @, 'entry:typed', (evt, entry) =>
                @start()
                if entry == @entries[@currentIndex]
                    console.log 'entry:is_correct', entry, @entries[@currentIndex]
                    @logs.push evt.timeStamp
                    @correctEntries++
                    @fixedMistakes++ if @entriesMapStatus[@currentIndex] == ENTRY_TO_BE_FIXED
                    @entriesMapStatus[@currentIndex] = ENTRY_CORRECT
                    @trigger 'entry:is_correct', @currentIndex
                    @currentIndex++
                    @stop() if @entries.length == @currentIndex
                else
                    console.log 'entry:is_incorrect', entry, @entries[@currentIndex]
                    @incorrectEntries++
                    @entriesMapStatus[@currentIndex] = ENTRY_INCORRECT
                    @trigger 'entry:is_incorrect', @currentIndex
                    @currentIndex++

            @listenTo @, 'entry:deleted', (evt) =>
                if @currentIndex > 0
                    @currentIndex--
                    console.log 'entry:is_reset', @entries[@currentIndex]
                    if @entriesMapStatus[@currentIndex] == ENTRY_INCORRECT
                        @entriesMapStatus[@currentIndex] = ENTRY_TO_BE_FIXED
                    @trigger 'entry:is_reset', @currentIndex

        start: ->
            unless @running
                console.log 'Game started'
                @running = true
                @startTime = new Date().getTime()
                timer = @timer
                @interval = setInterval(=>
                    if timer > 0
                        timer--
                    else @stop()
                , 1000)

        stop: ->
            console.log 'Game stopped'
            @running = false
            @stopTime = new Date().getTime()
            clearInterval(@interval)
            @stopListening()

            stats = @stats()
            console.log stats

            logs = $.makeArray @logs
            logs = $.map logs, (val, i) ->
                return null  if i is 0
                val - logs[i - 1]
            percent = parseInt _.uniq(logs).length / stats.totalEntries * 100, 10
            if percent < 20
                console.log 'You are a cheater'
            else
                console.log 'You are not a cheater'


        stats: ->
            elapsedTime = Math.ceil (@stopTime - @startTime) / 1000 # Seconds
            timerMinutes =  elapsedTime / 60
            totalEntries = @correctEntries + @incorrectEntries
            errorRate = (@incorrectEntries - @fixedMistakes) / timerMinutes
            rawSpeed = (totalEntries / timerMinutes) / 5

            correctEntries: @correctEntries
            incorrectEntries: @incorrectEntries
            fixedMistakes: @fixedMistakes
            totalEntries: totalEntries
            errorRate: errorRate
            rawSpeed: rawSpeed
            keySpeed: totalEntries / timerMinutes
            speed: rawSpeed - errorRate
            accuracy: (@correctEntries / totalEntries) * 100
            logs: @logs

        reset: ->
            @currentIndex = 0
            @correctEntries = 0
            @incorrectEntries = 0
            @fixedMistakes = 0
            @entriesMapStatus = []

        entries: (entries) ->
            @entries = entries if entries
            @entries

        timer: (timer) ->
            @timer = timer if timer
            @timer
